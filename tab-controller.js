// tab-controller.js
function showTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('show');
    tab.classList.remove('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('show');
    selectedTab.classList.add('active');
  }
  const selectedNavLink = document.getElementById(tabId + '-tab');
  if (selectedNavLink) {
    selectedNavLink.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showTab('home');
});
