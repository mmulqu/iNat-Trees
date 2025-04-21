
const CLIENT_ID = 'kNg0gso6U_16O7tkEJotSnmtcNE88dd_Xs-zb5SS8Pw'; // your iNat app ID
const redirectUri = 'https://inat-trees.replit.app/auth/callback';

export function startLogin() {
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

    window.location = authUrl;
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
  window.location = '/';
}

export function getAuthHeaders() {
  const token = localStorage.getItem('inat_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
