
import { fetchCurrentUser, startLogin } from './auth.js';

function renderAuthUI() {
  const btn = document.getElementById('inatLogin');
  const logoutBtn = document.getElementById('inatLogout');
  if (!btn) return;
  const user = localStorage.getItem('inat_username');
  if (user) {
    btn.classList.remove('btn-success');
    btn.classList.add('btn-outline-secondary');
    btn.innerHTML = `<i class="bi bi-check-circle me-1"></i> Connected as <strong>${user}</strong>`;
    btn.disabled = true;
    if (logoutBtn) {
      logoutBtn.classList.remove('d-none');
      logoutBtn.onclick = () => {
        localStorage.removeItem('inat_token');
        localStorage.removeItem('inat_username');
        location.reload();
      };
    }
  } else {
    btn.classList.add('btn-success');
    btn.classList.remove('btn-outline-secondary');
    btn.textContent = 'Connect my iNaturalist account';
    btn.disabled = false;
    btn.onclick = startLogin;
    if (logoutBtn) logoutBtn.classList.add('d-none');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Try storage-first, then fetch if needed
  if (!localStorage.getItem('inat_username') && localStorage.getItem('inat_token')) {
    await fetchCurrentUser();
  }
  renderAuthUI();
  window.addEventListener('storage', (e) => {
    if (e.key === 'inat_token' || e.key === 'inat_username') renderAuthUI();
  });
});
