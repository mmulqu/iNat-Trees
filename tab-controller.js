// tab-controller.js

function showTab(tabId) {
  document.querySelectorAll('.main-pane').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('show', 'active');
  });

  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('show', 'active');
  }

  const selectedNavLink = document.getElementById(tabId + '-tab');
  if (selectedNavLink) selectedNavLink.classList.add('active');

  // Flag current mode for CSS gating
  document.body.classList.toggle('in-pvp', tabId === 'pvpPane');

  // Re-render the active tree in whichever manager is relevant
  if (window.treeManager && typeof window.treeManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.treeManager.reRenderActiveTab(), 80);
  }
  if (window.pvpManager && typeof window.pvpManager.reRenderActiveTab === 'function') {
    setTimeout(() => window.pvpManager.reRenderActiveTab(), 80);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showTab('home');
});