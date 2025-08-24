
const CLIENT_ID = 'kNg0gso6U_16O7tkEJotSnmtcNE88dd_Xs-zb5SS8Pw'; //  your iNat app ID
const REDIRECT_URI = `https://inat-trees.replit.app/auth/callback`;



export function startLogin() {
  const btn = document.getElementById('inatLogin');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Redirecting…';

  // Clear any stale tokens/usernames so we don't reuse read-only grants
  try {
    localStorage.removeItem('inat_token');
    localStorage.removeItem('inat_username');
    localStorage.removeItem('inat_jwt');
  } catch (_) {}

  const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
  localStorage.setItem('inat_code_verifier', codeVerifier);

  import('./pkce.js').then(async ({ sha256base64url }) => {
    const codeChallenge = await sha256base64url(codeVerifier);
    const authUrl = new URL('https://www.inaturalist.org/oauth/authorize');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    // Request only the 'write' scope to enable JWT exchange at /users/api_token
    // IMPORTANT: request write scope so /users/api_token will succeed
    authUrl.searchParams.set('scope', 'write');

    window.location.href = authUrl;
  }).catch(err => {
    console.error(err);
    btn.disabled = false;
    btn.textContent = 'Connect my iNaturalist account';
    alert('Could not start login – see console for details.');
  });
}

export async function handleCallback() {
  const qs = new URLSearchParams(location.search);
  const code = qs.get('code');
  const state = qs.get('state');
  if (!code) return;

  const verifier = localStorage.getItem('inat_code_verifier');
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier,
    redirect_uri: REDIRECT_URI
  });

  const tok = await fetch('https://www.inaturalist.org/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  }).then(r => r.json());

  // store access token
  localStorage.setItem('inat_token', tok.access_token);

  // resolve username now (for UI)
  try {
    const me = await fetch('https://api.inaturalist.org/v1/users/me', {
      headers: { Authorization: `Bearer ${tok.access_token}` }
    }).then(r => r.json());
    const login = me?.results?.[0]?.login || '';
    if (login) localStorage.setItem('inat_username', login);
  } catch {}

  // optional: fetch API JWT and overwrite if valid
  try {
    const jwtText = await fetch('https://www.inaturalist.org/users/api_token', {
      headers: { Authorization: `Bearer ${tok.access_token}` }
    }).then(r => r.text());
    const jwt = jwtText.replace(/["']/g, '').trim();
    if (jwt && jwt.split('.').length === 3) {
      localStorage.setItem('inat_token', jwt);
    }
  } catch {}

  window.location = '/';
}

export function getAuthHeaders() {
  const token = localStorage.getItem('inat_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCurrentUser() {
  const token = localStorage.getItem('inat_token');
  console.log('[fetchCurrentUser] token =', token);

  if (!token) return null;

  try {
    const r = await fetch('https://www.inaturalist.org/users/edit.json', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return data.user ?? data;
  } catch (e) {
    console.error('Error fetching user:', e);
    return null;
  }
}
