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

  // Add body class flag for CSS gates
  document.body.classList.toggle('in-pvp', tabId === 'pvpPane');

  // ---- NEW: toggle which results UI is visible ----
  const resultsCard = document.getElementById('resultsCard');
  const pvpCard = document.getElementById('pvpResultsCard');
  const hasAnyTrees = !!(window.treeManager && Array.isArray(window.treeManager.trees) && window.treeManager.trees.length);

  if (tabId === 'pvpPane') {
    // On PvP: only show the mirror
    if (resultsCard) resultsCard.style.display = 'none';
    if (pvpCard) {
      // show mirror only if there is a comparison tab to mirror; else keep hidden
      const hasCompareActive = document.querySelector('#treeTabs .nav-link.active');
      pvpCard.style.display = hasCompareActive ? 'block' : 'none';
    }
    try { window.pvpMirror?.refreshActive(); } catch(_) {}
  } else {
    // On Explore/Checkpoints: show the global results (if any trees), hide the PvP mirror
    if (resultsCard) resultsCard.style.display = hasAnyTrees ? 'block' : 'none';
    if (pvpCard) pvpCard.style.display = 'none';
  }
  // -----------------------------------------------

  // After layout settles, ask TreeManager to re-render the active tree
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 80);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initial setup
  showTab('home');
});