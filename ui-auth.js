
import { fetchCurrentUser, startLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('inatLogin');
  const logoutBtn = document.getElementById('inatLogout');
  if (!btn) return;

  const existingUser = localStorage.getItem('inat_username') 
                    || (await fetchCurrentUser())?.login;

  if (existingUser) {
    btn.classList.replace('btn-success', 'btn-outline-secondary');
    btn.innerHTML = `<i class="bi bi-check-circle me-1"></i> Connected as <strong>${existingUser}</strong>`;
    btn.disabled = true;
    
    if (logoutBtn) {
      logoutBtn.classList.remove('d-none');
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('inat_token');
        localStorage.removeItem('inat_username');
        location.reload();
      });
    }
  } else {
    btn.addEventListener('click', startLogin);
  }
});
