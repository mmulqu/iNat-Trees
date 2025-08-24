
const INAT_CLIENT_ID = 'kNg0gso6U_16O7tkEJotSnmtcNE88dd_Xs-zb5SS8Pw';
const ORIGIN = window.location.origin;
const REDIRECT_URI   = `${ORIGIN}/callback.html`;
const AUTHZ_URL      = 'https://www.inaturalist.org/oauth/authorize';
const TOKEN_URL      = 'https://www.inaturalist.org/oauth/token';
const API_TOKEN_URL  = 'https://www.inaturalist.org/users/api_token';
const API_ME_URL     = 'https://api.inaturalist.org/v1/users/me';

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
}
async function sha256(s) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
}



export async function startLogin() {
  const state = crypto.getRandomValues(new Uint32Array(4)).join('-');
  const verifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2,'0')).join('');
  const challenge = base64url(await sha256(verifier));

  // Clear any stale tokens
  try { localStorage.removeItem('inat_token'); localStorage.removeItem('inat_username'); } catch {}

  localStorage.setItem('pkce_state', state);
  localStorage.setItem('pkce_verifier', verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: INAT_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'write',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });
  window.location = `${AUTHZ_URL}?${params.toString()}`;
}

export async function handleCallback() {
  const qs = new URLSearchParams(location.search);
  const code  = qs.get('code');
  const state = qs.get('state');
  if (!code) return;

  const expected = localStorage.getItem('pkce_state');
  const verifier  = localStorage.getItem('pkce_verifier');
  localStorage.removeItem('pkce_state');
  localStorage.removeItem('pkce_verifier');
  if (!expected || state !== expected) { console.error('PKCE state mismatch'); return; }

  // 1) Exchange code -> access_token
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: INAT_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  });
  const tokRes = await fetch(TOKEN_URL, { method:'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body });
  const tok = await tokRes.json();
  if (!tok?.access_token) { console.error('Token endpoint did not return access_token', tok); return; }

  // 2) access_token -> JWT
  const jwtRes = await fetch(API_TOKEN_URL, { headers: { Authorization: `Bearer ${tok.access_token}` } });
  let jwtText = await jwtRes.text();
  try { jwtText = JSON.parse(jwtText).api_token || jwtText; } catch {}
  const jwt = String(jwtText).replace(/["']/g,'').trim();
  if (!jwt || jwt.split('.').length !== 3) { console.error('Failed to obtain JWT from users/api_token'); return; }

  // 3) Save JWT
  localStorage.setItem('inat_token', jwt);

  // 4) Populate username
  try { await fetchCurrentUser(); } catch {}

  history.replaceState({}, '', REDIRECT_URI);
}

export function getAuthHeaders() {
  const t = localStorage.getItem('inat_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchCurrentUser() {
  const t = localStorage.getItem('inat_token');
  if (!t) return null;
  try {
    const res = await fetch(API_ME_URL, {
      headers: { Authorization: `Bearer ${t}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const login = data?.results?.[0]?.login || null;
    if (login) localStorage.setItem('inat_username', login);
    return login ? { login } : null;
  } catch (e) {
    console.error('Error fetching user:', e);
    return null;
  }
}
