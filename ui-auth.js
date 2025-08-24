
import { startLogin, signOut, fetchCurrentUser, getAuthHeaders } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('inatLogin');
  const logoutBtn = document.getElementById('inatLogout');
  const whoamiEl = document.getElementById('whoami');

  if (loginBtn) loginBtn.onclick = startLogin;
  if (logoutBtn) logoutBtn.onclick = () => { signOut(); location.reload(); };

  let login = localStorage.getItem('inat_username');
  if (!login && localStorage.getItem('inat_token')) {
    const me = await fetchCurrentUser();
    login = me?.login || null;
  }
  if (whoamiEl) whoamiEl.textContent = login ? `Signed in as ${login}` : 'Not signed in';
});
