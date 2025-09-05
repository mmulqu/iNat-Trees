// tab-controller.js

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

  // If switching to PvP, mirror whatever comparison tab is active
  if (tabId === 'pvpPane') {
    try { window.pvpMirror?.refreshActive(); } catch(_){}
  }

  // After layout settles, ask TreeManager to re-render the active tree
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 80);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial setup
  showTab('home');
});