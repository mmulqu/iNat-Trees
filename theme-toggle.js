// theme-toggle.js
(function() {
  const root = document.body;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const key = 'inat_theme_v1';

  function apply(theme) {
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      if (icon) icon.className = 'bi bi-sun';
    } else {
      root.classList.remove('dark-theme');
      if (icon) icon.className = 'bi bi-moon';
    }
  }

  // Load saved theme or prefer system
  let saved = null;
  try { saved = localStorage.getItem(key); } catch(_) {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  if (btn) {
    btn.addEventListener('click', function() {
      const isDark = root.classList.contains('dark-theme');
      const next = isDark ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(key, next); } catch(_) {}
    });
  }
})();
