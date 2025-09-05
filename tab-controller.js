// tab-controller.js

function updatePvPMirror() {
  const pvpResultsCard = document.getElementById('pvpResultsCard');
  const pvpMirror = document.getElementById('pvpMirror');
  if (!pvpResultsCard || !pvpMirror) return;

  // Find the active comparison tree tab
  const activeTab = document.querySelector('#treeTabs .nav-link.active');
  if (!activeTab) {
    pvpResultsCard.style.display = 'none';
    return;
  }

  const treeId = activeTab.id.replace('-tab', '');
  const treeContent = document.getElementById(`${treeId}-content`);
  if (!treeContent) {
    pvpResultsCard.style.display = 'none';
    return;
  }

  // Check if this is a comparison tree
  const isComparison = treeContent.dataset.username1 && treeContent.dataset.username2;
  if (!isComparison) {
    pvpResultsCard.style.display = 'none';
    return;
  }

  // Clone the tree content for the mirror
  const clone = treeContent.cloneNode(true);
  
  // Sanitize the clone to avoid ID conflicts
  sanitizeClone(clone);
  
  // Clear and populate the mirror
  pvpMirror.innerHTML = '';
  pvpMirror.appendChild(clone);
  
  // Show the PvP results card
  pvpResultsCard.style.display = 'block';
}

function sanitizeClone(clone) {
  // Remove any existing IDs to prevent conflicts
  const elementsWithIds = clone.querySelectorAll('[id]');
  elementsWithIds.forEach(el => {
    const originalId = el.id;
    el.id = `pvp-${originalId}`;
    
    // Update any references to the original ID
    const labels = clone.querySelectorAll(`label[for="${originalId}"]`);
    labels.forEach(label => label.setAttribute('for', `pvp-${originalId}`));
    
    const ariaControls = clone.querySelectorAll(`[aria-controls="${originalId}"]`);
    ariaControls.forEach(control => control.setAttribute('aria-controls', `pvp-${originalId}`));
    
    const ariaLabelledBy = clone.querySelectorAll(`[aria-labelledby="${originalId}"]`);
    ariaLabelledBy.forEach(control => control.setAttribute('aria-labelledby', `pvp-${originalId}`));
  });
  
  // Remove any event listeners by cloning again
  const cleanClone = clone.cloneNode(true);
  clone.parentNode.replaceChild(cleanClone, clone);
}

function showTab(tabId) {
  // Hide all main panes
  document.querySelectorAll('.main-pane').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('show', 'active');
  });

  // Deactivate nav links
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected pane
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('show', 'active');
  }

  // Activate matching nav link
  const selectedNavLink = document.getElementById(tabId + '-tab');
  if (selectedNavLink) selectedNavLink.classList.add('active');

  // Update PvP mirror if we're switching to PvP tab
  if (tabId === 'pvpPane') {
    setTimeout(() => updatePvPMirror(), 100);
  }

  // After layout settles, ask TreeManager to re-render the active tree
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 80);
  }
}

// Listen for tree tab changes to update PvP mirror
document.addEventListener('DOMContentLoaded', function() {
  // Initial setup
  showTab('home');
  
  // Listen for tree tab changes
  const treeTabs = document.getElementById('treeTabs');
  if (treeTabs) {
    treeTabs.addEventListener('click', (e) => {
      const tabLink = e.target.closest('.nav-link');
      if (tabLink) {
        setTimeout(() => updatePvPMirror(), 200);
      }
    });
  }
  
  // Listen for tree additions/removals
  if (window.treeManager) {
    const originalAddTree = window.treeManager.addTree;
    const originalAddComparisonTree = window.treeManager.addComparisonTree;
    const originalRemoveTree = window.treeManager.removeTree;
    
    window.treeManager.addTree = function(...args) {
      const result = originalAddTree.apply(this, args);
      setTimeout(() => updatePvPMirror(), 100);
      return result;
    };
    
    window.treeManager.addComparisonTree = function(...args) {
      const result = originalAddComparisonTree.apply(this, args);
      setTimeout(() => updatePvPMirror(), 100);
      return result;
    };
    
    window.treeManager.removeTree = function(...args) {
      const result = originalRemoveTree.apply(this, args);
      setTimeout(() => updatePvPMirror(), 100);
      return result;
    };
  }
});