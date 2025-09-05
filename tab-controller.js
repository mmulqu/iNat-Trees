// tab-controller.js
function showTab(tabId) {
  // Hide all main panes
  document.querySelectorAll('.main-pane').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('show');
    tab.classList.remove('active');
  });

  // Deactivate nav links
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show selected pane
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('show');
    selectedTab.classList.add('active');
  }

  // Activate matching nav link
  const selectedNavLink = document.getElementById(tabId + '-tab');
  if (selectedNavLink) {
    selectedNavLink.classList.add('active');
  }

  // Ask TreeManager to re-render the active tree after layout settles
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 50);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showTab('home');
});