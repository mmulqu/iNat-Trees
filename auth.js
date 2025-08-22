
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
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return;

  const codeVerifier = localStorage.getItem('inat_code_verifier');
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier
  });

  const r = await fetch('https://www.inaturalist.org/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const token = await r.json();
  localStorage.setItem('inat_token', token.access_token);

  // Exchange OAuth access token for a v1 API JWT and store it
  try {
    const jwtRes = await fetch('https://www.inaturalist.org/users/api_token', {
      headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/json' }
    });
    if (jwtRes.ok) {
      const jwtData = await jwtRes.json().catch(() => ({}));
      const jwt = jwtData.api_token || jwtData.token;
      if (jwt) localStorage.setItem('inat_jwt', jwt);
    } else {
      console.error('JWT exchange failed with status', jwtRes.status);
    }
  } catch (e) {
    console.error('JWT exchange error:', e);
  }
  
  // Store username on first login
  const me = await fetchCurrentUser();
  if (me) localStorage.setItem('inat_username', me.login);
  
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
