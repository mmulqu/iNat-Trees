// tab-controller.js

function teleportResults(tabId) {
  const container = document.getElementById('resultsCardContainer');
  if (!container) return;

  const homeMount = document.getElementById('resultsMountHome');
  const pvpMount = document.getElementById('resultsMountPvP');

  let target = null;
  if (tabId === 'home') target = homeMount;
  else if (tabId === 'pvpPane') target = pvpMount;
  else if (tabId === 'checkpointsPane') {
    // Keep the shared results with Home while in Checkpoints,
    // since Checkpoints has its own cpResultsCard.
    target = homeMount;
  }

  if (target && container.parentElement !== target) {
    target.appendChild(container);
  }
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

  // Move the Results card into the active pane
  teleportResults(tabId);

  // After layout settles, ask TreeManager to re-render the active tree
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 80);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Park results under Home on initial load
  teleportResults('home');
  showTab('home');
});