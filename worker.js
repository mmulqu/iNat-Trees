// Durable Object: global rate limiter keyed by token/username
export class RateLimiter {
	constructor(state, env) {
		this.state = state;
		this.lastTs = 0;
	}
	async fetch(request) {
		const url = new URL(request.url);
		const gap = Math.max(0, parseInt(url.searchParams.get('gap') || '1000', 10));
		const now = Date.now();
		const waitMs = this.lastTs ? Math.max(0, this.lastTs + gap - now) : 0;
		this.lastTs = now + waitMs;
		if (waitMs > 0) {
			await new Promise(res => setTimeout(res, waitMs));
		}
		return new Response('ok');
	}
}

async function acquireLimiter(env, key, minGapMs = 1000) {
	try {
		const id = env.RATE_LIMITER.idFromName(key);
		const stub = env.RATE_LIMITER.get(id);
		await stub.fetch('https://limiter/acquire?gap=' + Math.max(0, minGapMs), { method: 'POST' });
	} catch (_) {}
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Normalize observation date to YYYY-MM-DD
function toISODateOnly(v) {
  if (!v) return null;
  try {
    // Accept "YYYY-MM-DD", "YYYY-MM-DDTHH:MM:SSZ", etc.
    const d = new Date(v);
    if (!Number.isFinite(d.getTime())) return null;
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch { return null; }
}

function isSpeciesRank(rank) {
  const r = String(rank || '').toLowerCase();
  // include infraspecific ranks so they count toward the species leaf in your tree
  return r === 'species' || r === 'subspecies' || r === 'variety' || r === 'form';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "");

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request) });
    }

    try {
      if (pathname === '/search-taxa' && request.method === 'GET') {
        return searchTaxa(request, env);
      }

      if (pathname === '/build-taxonomy' && request.method === 'POST') {
        return buildTaxonomy(request, env);
      }

      if (pathname === '/compare-taxa' && request.method === 'POST') {
        return compareTaxa(request, env);
      }

      // Checkpoint API
      if (pathname === '/checkpoints/save' && request.method === 'POST') {
        await ensureCheckpointTables(env);
        return saveCheckpoint(request, env);
      }
      if (pathname === '/checkpoints/list' && request.method === 'GET') {
        await ensureCheckpointTables(env);
        return listCheckpoints(request, env);
      }

      if (pathname === '/checkpoints/delete' && request.method === 'POST') {
        await ensureCheckpointTables(env);
        return deleteCheckpoint(request, env);
      }

      if (pathname === '/tree-from-species' && request.method === 'POST') {
        return treeFromSpecies(request, env);
      }

      if (pathname === '/timeline/first-seen' && request.method === 'POST') {
        return firstSeenTimeline(request, env);
      }
      if (pathname === '/timeline/index' && request.method === 'POST') {
        await ensureCheckpointTables(env);
        return timelineIndex(request, env);
      }
      if (pathname === '/timeline/date-range' && request.method === 'GET') {
        await ensureCheckpointTables(env);
        return timelineDateRange(request, env);
      }
      if (pathname === '/timeline/tree-at-date' && request.method === 'POST') {
        await ensureCheckpointTables(env);
        return timelineTreeAtDate(request, env);
      }
      // First observation lookup
      if (pathname === '/first-observation' && request.method === 'GET') {
        return firstObservation(request, env);
      }

      if (pathname === '/timeline/precache' && request.method === 'POST') {
        await ensureCheckpointTables(env);
        return timelinePrecache(request, env);
      }

      return json({ error: 'Not found' }, 404, request);
    } catch (err) {
      return json({ error: err?.message || String(err) }, 500, request);
    }
  }
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Expose-Headers': 'X-Auth-Received, X-Auth-UsableJWT',
  };
}

function json(data, status = 200, request, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(request ? corsHeaders(request) : { 'Access-Control-Allow-Origin': '*' }),
      ...(extraHeaders || {})
    }
  });
}

const VALID_HIGHER_RANKS = new Set([
  'genus', 'family', 'subfamily', 'tribe', 'subtribe', 'order', 'suborder',
  'infraorder', 'parvorder', 'class', 'subclass', 'infraclass', 'superclass',
  'phylum', 'subphylum', 'kingdom', 'domain', 'superkingdom', 'stateofmatter'
]);

const RATE_LIMIT_CONFIG = {
  perPage: 200,
  delayBetweenPages: 600,
  delayBetweenUsers: 1000,
  maxRetries: 5,
  initialRetryDelay: 1000,
  maxPages: 10,
  maxPagesBuild: 1,
  cacheEnabled: true,
  cacheTTL: 300,
  jwtCacheTTL: 82800,
  minGlobalGapMs: 2000
};

const requestCache = new Map();
const jwtCache = new Map();

function isJWT(token) { const parts = token.split('.'); return parts.length === 3; }

async function getJWTFromOAuth(oauthToken) {
  let attempts = 0;
  let lastErr = null;
  while (attempts < RATE_LIMIT_CONFIG.maxRetries) {
    attempts += 1;
    try {
      const response = await fetch('https://www.inaturalist.org/users/api_token', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${oauthToken}`, 'Accept': 'application/json', 'User-Agent': 'iNat-Trees-Cloudflare/1.0' }
      });
      if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
        let delayMs = RATE_LIMIT_CONFIG.initialRetryDelay * Math.pow(2, attempts - 1);
        const ra = response.headers.get('Retry-After');
        if (ra) {
          const secs = parseInt(ra, 10);
          if (!Number.isNaN(secs)) delayMs = Math.max(delayMs, secs * 1000);
        }
        await sleep(delayMs);
        continue;
      }
      if (!response.ok) {
        lastErr = new Error('JWT exchange HTTP ' + response.status);
        break;
      }
      const text = await response.text();
      try { const data = JSON.parse(text); return data.api_token || data.token || null; }
      catch { return text.trim().replace(/['"]/g, ''); }
    } catch (e) {
      lastErr = e;
      await sleep(300);
    }
  }
  return null;
}

async function processAuthHeader(authHeader) {
  if (!authHeader) return null;
  const cachedJWT = jwtCache.get(authHeader);
  if (cachedJWT && Date.now() - cachedJWT.timestamp < RATE_LIMIT_CONFIG.jwtCacheTTL * 1000) {
    return cachedJWT.token;
  }
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) token = authHeader.substring(7);
  if (isJWT(token)) {
    jwtCache.set(authHeader, { token, timestamp: Date.now() });
    return token;
  }
  const jwtToken = await getJWTFromOAuth(token);
  if (jwtToken) jwtCache.set(authHeader, { token: jwtToken, timestamp: Date.now() });
  return jwtToken || null;
}

function decodeJwtPayload(jwt) {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload || null;
  } catch { return null; }
}

async function requireLogin(request) {
  const rawAuth = request.headers.get('Authorization') || '';
  if (!rawAuth) return { login: null, jwt: null };

  // Normalize bearer (could be access token or JWT)
  const bearer = rawAuth.startsWith('Bearer ') ? rawAuth.substring(7) : rawAuth;

  // Try to convert to JWT (if it's already a JWT, processAuthHeader just returns it)
  const jwt = await processAuthHeader(rawAuth);

  // If we have a JWT, try to read a login claim
  if (jwt) {
    const payload = decodeJwtPayload(jwt) || {};
    let login = payload.user_login || payload.login || payload.preferred_username || payload.username || null;
    // Some iNat JWTs don't carry login; resolve via users/me using the same JWT
    if (!login) {
      try {
        const r = await fetch('https://api.inaturalist.org/v1/users/me', {
          headers: { Authorization: `Bearer ${jwt}`, 'User-Agent': 'iNat-Trees-Cloudflare/1.0' }
        });
        if (r.ok) {
          const j = await r.json().catch(() => ({}));
          login = j?.results?.[0]?.login || null;
        }
      } catch (_) {}
    }
    return { login, jwt };
  }

  // No JWT? It was likely a raw OAuth access token. Resolve login via users/me.
  try {
    const r = await fetch('https://api.inaturalist.org/v1/users/me', {
      headers: { Authorization: `Bearer ${bearer}`, 'User-Agent': 'iNat-Trees-Cloudflare/1.0' }
    });
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      const login = j?.results?.[0]?.login || null;
      if (login) return { login, jwt: null };
    }
  } catch (_) {}

  return { login: null, jwt: null };
}

function getCacheKey(username, taxonId) { return `${username}:${taxonId}`; }

async function getCachedOrFetch(env, username, taxonId, authHeader) {
  const cacheKey = getCacheKey(username, taxonId);
  if (RATE_LIMIT_CONFIG.cacheEnabled && requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    if (Date.now() - cached.timestamp < RATE_LIMIT_CONFIG.cacheTTL * 1000) return cached.data;
  }
  const limiterKey = authHeader || `${username}:${taxonId}`;
  const data = await fetchUserObservations(env, username, taxonId, authHeader, RATE_LIMIT_CONFIG.maxPagesBuild, limiterKey);
  if (RATE_LIMIT_CONFIG.cacheEnabled) requestCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

async function fetchUserObservations(env, username, taxonId, authHeader, maxPages = Infinity, limiterKey) {
  let page = 1;
  const perPage = RATE_LIMIT_CONFIG.perPage;
  let all = [];
  while (true) {
    const url = new URL('https://api.inaturalist.org/v1/observations');
    url.searchParams.set('user_login', username);
    url.searchParams.set('taxon_id', String(taxonId));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('page', String(page));
    url.searchParams.set('include', 'taxon');
    url.searchParams.set('quality_grade', 'any');
    url.searchParams.set('verifiable', 'any');

    const headers = { 'User-Agent': 'iNat-Trees-Cloudflare/1.0' };
    if (authHeader) headers['Authorization'] = authHeader;

    // global serialization per token/username
    await acquireLimiter(env, limiterKey || 'anon', RATE_LIMIT_CONFIG.minGlobalGapMs);

    // retry with backoff
    let r, attempts = 0;
    while (true) {
      r = await fetch(url.toString(), { headers });
      if (r.status === 429 || (r.status >= 500 && r.status < 600)) {
        attempts += 1;
        if (attempts > RATE_LIMIT_CONFIG.maxRetries) break;
        let delayMs = RATE_LIMIT_CONFIG.initialRetryDelay * Math.pow(2, attempts - 1);
        const ra = r.headers.get('Retry-After');
        if (ra) {
          const secs = parseInt(ra, 10);
          if (!Number.isNaN(secs)) delayMs = Math.max(delayMs, secs * 1000);
        }
        await sleep(delayMs + Math.floor(Math.random()*200));
        continue;
      }
      break;
    }

    if (!r.ok) throw new Error(`iNat HTTP ${r.status}`);
    const data = await r.json();
    all = all.concat(data.results || []);
    if ((data.results || []).length < perPage) break;
    if (page >= maxPages) break;
    page += 1;
    await sleep(RATE_LIMIT_CONFIG.delayBetweenPages);
  }
  return all;
}

async function compareTaxa(request, env) {
  const body = await request.json();
  const { username1, username2, taxonId } = body || {};
  if (!username1 || !username2 || !taxonId) return json({ error: 'Missing parameters: username1, username2, taxonId' }, 400, request);
  const rawAuth = request.headers.get('Authorization') || '';
  const jwt = await processAuthHeader(rawAuth);
  const authHeader = jwt ? `Bearer ${jwt}` : undefined; // only send JWT to v1 API
  const key = authHeader || `${username1}:${username2}:${taxonId}`;

  const user1Obs = await fetchUserObservations(env, username1, taxonId, authHeader, Infinity, key);
  await sleep(RATE_LIMIT_CONFIG.delayBetweenUsers);
  const user2Obs = await fetchUserObservations(env, username2, taxonId, authHeader, Infinity, key);

  if ((user1Obs.length === 0) && (user2Obs.length === 0)) return json({ markdown: `- No observations found for either user under taxon ID ${taxonId}` }, 200, request);

  const user1TaxonIds = Array.from(new Set(user1Obs.filter(o => o.taxon).map(o => o.taxon.id)));
  const user2TaxonIds = Array.from(new Set(user2Obs.filter(o => o.taxon).map(o => o.taxon.id)));

  const tree = await buildComparisonTree(env, user1TaxonIds, user2TaxonIds, taxonId);
  const stats = generateComparisonStats(user1TaxonIds, user2TaxonIds);
  const markdown = treeToMarkdown(tree, 0, { username1, username2, mode: 'compare' });
  const plainMarkdown = toPlainMarkdown(markdown);

  return json({ markdown, plainMarkdown, stats, user1Count: user1TaxonIds.length, user2Count: user2TaxonIds.length }, 200, request);
}

async function buildTaxonomy(request, env) {
  try {
    const body = await request.json();
    const { username, taxonId } = body || {};
    if (!username || !taxonId) return json({ error: 'Missing parameters: username, taxonId' }, 400, request);
    const rawAuth = request.headers.get('Authorization') || '';
    const hadAuthHeader = !!rawAuth;
    const jwt = await processAuthHeader(rawAuth);
    const authHeader = jwt ? `Bearer ${jwt}` : undefined; // only send JWT to v1 API
    const debugHeaders = { 'X-Auth-Received': String(hadAuthHeader), 'X-Auth-UsableJWT': String(!!jwt) };

    // Force build-taxonomy to only request one page to reduce pressure
    const observations = await fetchUserObservations(env, username, taxonId, authHeader, RATE_LIMIT_CONFIG.maxPagesBuild, authHeader || `${username}:${taxonId}`);
    if (!observations || observations.length === 0) return json({ markdown: `- No observations found for user ${username} under taxon ID ${taxonId}`, auth: { received: hadAuthHeader, usableJWT: !!jwt } }, 200, request, debugHeaders);

    const seen = new Map();
    for (const obs of observations) {
      if (obs.taxon && obs.taxon.id && obs.taxon.preferred_common_name) {
        if (!seen.has(obs.taxon.id)) seen.set(obs.taxon.id, obs.taxon.preferred_common_name);
      }
    }
    for (const [id, commonName] of seen.entries()) {
      try { await env.DB.prepare(`UPDATE taxa SET common_name = ? WHERE taxon_id = ? AND (common_name IS NULL OR TRIM(common_name) = '')`).bind(commonName, id).run(); } catch (_) {}
    }

    const speciesIds = Array.from(new Set(observations.filter(o => o.taxon).map(o => o.taxon.id)));
    // Rank counts (distinct taxa by id)
    const rankCounts = {};
    const distinctById = new Map();
    for (const obs of observations) {
      if (obs.taxon && obs.taxon.id) {
        if (!distinctById.has(obs.taxon.id)) distinctById.set(obs.taxon.id, obs.taxon);
      }
    }
    for (const taxon of distinctById.values()) {
      const r = (taxon.rank || '').toLowerCase();
      rankCounts[r] = (rankCounts[r] || 0) + 1;
    }
    // High watermark = max updated_at (fallback observed_on/created_at)
    let highWatermark = null;
    for (const obs of observations) {
      const ts = obs.updated_at || obs.observed_on || obs.created_at;
      if (ts) {
        const iso = new Date(ts).toISOString();
        if (!highWatermark || iso > highWatermark) highWatermark = iso;
      }
    }

    const tree = await buildTreeFromDatabase(env, speciesIds, taxonId);
    const markdown = treeToMarkdown(tree, 0, { username });
    const plainMarkdown = toPlainMarkdown(markdown);
    return json({ markdown, plainMarkdown, speciesTaxonIds: speciesIds, rankCounts, highWatermarkUpdatedAt: highWatermark, auth: { received: hadAuthHeader, usableJWT: !!jwt } }, 200, request, debugHeaders);
  } catch (e) {
    const msg = e?.message || String(e);
    // Try to echo the auth debug on errors too
    const rawAuth = request.headers.get('Authorization') || '';
    const hadAuthHeader = !!rawAuth;
    // Best-effort to compute JWT flag again (cheap if cached)
    let usable = false;
    try {
      const jwt = await processAuthHeader(rawAuth);
      usable = !!jwt;
    } catch {}
    const debugHeaders = { 'X-Auth-Received': String(hadAuthHeader), 'X-Auth-UsableJWT': String(usable) };
    if (msg.includes('iNat HTTP 429')) return json({ error: 'Rate limited by iNaturalist. Please try again in a moment.', auth: { received: hadAuthHeader, usableJWT: usable } }, 429, request, debugHeaders);
    return json({ error: msg, auth: { received: hadAuthHeader, usableJWT: usable } }, 500, request, debugHeaders);
  }
}

// ========== Keep existing helper functions below ==========
// Checkpoint schema and handlers
async function ensureCheckpointTables(env) {
  const createMain = `CREATE TABLE IF NOT EXISTS checkpoints (
    id TEXT PRIMARY KEY,
    user_login TEXT NOT NULL,
    taxon_id INTEGER NOT NULL,
    taxon_name TEXT,
    species_ids_json TEXT NOT NULL,
    rank_counts_json TEXT NOT NULL,
    high_watermark_updated_at TEXT,
    created_at TEXT NOT NULL
  )`;
  const createIdx = `CREATE INDEX IF NOT EXISTS idx_checkpoints_user_taxon ON checkpoints(user_login, taxon_id, created_at)`;
  await env.DB.prepare(createMain).run();
  await env.DB.prepare(createIdx).run();
  // First-seen cache table
  const createFirstSeen = `CREATE TABLE IF NOT EXISTS first_seen (
    user_login TEXT NOT NULL,
    taxon_id INTEGER NOT NULL,
    species_id INTEGER NOT NULL,
    first_seen TEXT,
    PRIMARY KEY (user_login, taxon_id, species_id)
  )`;
  const idxFirst = `CREATE INDEX IF NOT EXISTS idx_first_seen_user_taxon ON first_seen(user_login, taxon_id)`;
  await env.DB.prepare(createFirstSeen).run();
  await env.DB.prepare(idxFirst).run();

  // === NEW: per-user, per-base-taxon event log (species × date) ===
  const createUserObsEvents = `CREATE TABLE IF NOT EXISTS user_obs_events (
    user_login TEXT NOT NULL,
    taxon_id   INTEGER NOT NULL,   -- base taxon (e.g., 47126 = Plants)
    species_id INTEGER NOT NULL,   -- leaf species taxon_id
    observed_on TEXT NOT NULL,     -- ISO date YYYY-MM-DD
    PRIMARY KEY (user_login, taxon_id, species_id, observed_on)
  )`;
  const idxUserObsEvents = `CREATE INDEX IF NOT EXISTS idx_user_obs_events_range
    ON user_obs_events(user_login, taxon_id, observed_on)`;
  await env.DB.prepare(createUserObsEvents).run();
  await env.DB.prepare(idxUserObsEvents).run();

  // === NEW: per-user, per-base-taxon species summary (min/max dates) ===
  const createUserObsSummary = `CREATE TABLE IF NOT EXISTS user_obs_summary (
    user_login TEXT NOT NULL,
    taxon_id   INTEGER NOT NULL,
    species_id INTEGER NOT NULL,
    first_seen TEXT,               -- earliest YYYY-MM-DD
    last_seen  TEXT,               -- latest YYYY-MM-DD
    PRIMARY KEY (user_login, taxon_id, species_id)
  )`;
  const idxUserObsSummary = `CREATE INDEX IF NOT EXISTS idx_user_obs_summary_range
    ON user_obs_summary(user_login, taxon_id, first_seen, last_seen)`;
  await env.DB.prepare(createUserObsSummary).run();
  await env.DB.prepare(idxUserObsSummary).run();

  // Precomputed timeline cache per checkpoint (8 points)
  const createPrecache = `CREATE TABLE IF NOT EXISTS timeline_precache (
    id TEXT PRIMARY KEY,
    user_login TEXT NOT NULL,
    taxon_id INTEGER NOT NULL,
    checkpoint_id TEXT NOT NULL,
    dates_json TEXT NOT NULL,
    markdowns_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`;
  const idxPrecache = `CREATE INDEX IF NOT EXISTS idx_precache_user_taxon ON timeline_precache(user_login, taxon_id, checkpoint_id)`;
  await env.DB.prepare(createPrecache).run();
  await env.DB.prepare(idxPrecache).run();
}

function uuidv4() {
  const rnd = crypto.getRandomValues(new Uint8Array(16));
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  const hex = Array.from(rnd, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

async function saveCheckpoint(request, env) {
  const { login } = await requireLogin(request);
  if (!login) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { username, taxonId, taxonName, speciesTaxonIds, rankCounts, highWatermarkUpdatedAt } = body || {};
  if (!username || !taxonId || !Array.isArray(speciesTaxonIds)) {
    return json({ error: 'Missing parameters: username, taxonId, speciesTaxonIds' }, 400, request);
  }
  if (username !== login) return json({ error: 'Forbidden' }, 403, request);
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO checkpoints (id, user_login, taxon_id, taxon_name, species_ids_json, rank_counts_json, high_watermark_updated_at, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await env.DB.prepare(sql).bind(
    id,
    username,
    parseInt(taxonId, 10),
    taxonName || null,
    JSON.stringify(speciesTaxonIds),
    JSON.stringify(rankCounts || {}),
    highWatermarkUpdatedAt || null,
    createdAt
  ).run();
  // Fire-and-forget: kick off precache for this checkpoint (forward auth header)
  try {
    const rawAuth = request.headers.get('Authorization') || '';
    const payload = { username, taxonId: parseInt(taxonId,10), checkpointId: id };
    await timelinePrecache(new Request('http://local/timeline/precache', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': rawAuth }, body: JSON.stringify(payload) }), env);
  } catch (_) {}
  return json({ id, createdAt }, 200, request);
}

async function listCheckpoints(request, env) {
  const url = new URL(request.url);
  const { login } = await requireLogin(request);
  const user = (url.searchParams.get('user_login') || '').trim();
  const taxonId = url.searchParams.get('taxon_id');
  const include = url.searchParams.get('include') || 'meta';
  if (!user) return json({ error: 'user_login is required' }, 400, request);
  const rawAuth = request.headers.get('Authorization') || '';
  const hadAuthHeader = !!rawAuth;
  let usable = false; try { usable = !!(await processAuthHeader(rawAuth)); } catch {}
  const debug = { 'X-Auth-Received': String(hadAuthHeader), 'X-Auth-UsableJWT': String(usable) };
  if (!login || login !== user) return json({ error: 'Forbidden' }, 403, request, debug);
  let sql = `SELECT id, user_login, taxon_id, taxon_name, created_at`;
  if (include === 'full') sql += `, species_ids_json, rank_counts_json, high_watermark_updated_at`;
  sql += ` FROM checkpoints WHERE user_login = ?`;
  const binds = [user];
  if (taxonId) { sql += ' AND taxon_id = ?'; binds.push(parseInt(taxonId, 10)); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ checkpoints: results || [] }, 200, request, debug);
}

async function deleteCheckpoint(request, env) {
  const { login } = await requireLogin(request);
  if (!login) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return json({ error: 'Missing parameters: id' }, 400, request);
  // Only delete if owned by the requester
  const row = await env.DB.prepare(`SELECT user_login FROM checkpoints WHERE id = ?`).bind(id).first();
  if (!row || row.user_login !== login) return json({ error: 'Forbidden' }, 403, request);
  await env.DB.prepare(`DELETE FROM checkpoints WHERE id = ?`).bind(id).run();
  return json({ ok: true }, 200, request);
}

// Build a tree from a provided list of species taxon IDs (for checkpoint playback)
async function treeFromSpecies(request, env) {
  try {
    const body = await request.json();
    const { speciesTaxonIds, baseTaxonId } = body || {};
    if (!Array.isArray(speciesTaxonIds) || !baseTaxonId) {
      return json({ error: 'Missing parameters: speciesTaxonIds[], baseTaxonId' }, 400, request);
    }
    const tree = await buildTreeFromDatabase(env, speciesTaxonIds, baseTaxonId);
    const markdown = treeToMarkdown(tree);
    const plainMarkdown = toPlainMarkdown(markdown);
    return json({ markdown, plainMarkdown }, 200, request);
  } catch (e) {
    return json({ error: e?.message || String(e) }, 500, request);
  }
}

// Compute first-seen date per species taxon id for a user and base taxon
// Request body: { username, taxonId, authHeader? }
// Response: { firstSeen: { [taxonId]: isoDate }, species: number[] }
async function firstSeenTimeline(request, env) {
  try {
    await ensureCheckpointTables(env);
    const { login } = await requireLogin(request);
    if (!login) return json({ error: 'Unauthorized' }, 401, request);
    const body = await request.json();
    const { username, taxonId } = body || {};
    if (!username || !taxonId) return json({ error: 'Missing parameters: username, taxonId' }, 400, request);
    if (username !== login) return json({ error: 'Forbidden' }, 403, request);

    // Read first-seen dates purely from DB (no iNat API calls)
    // Prefer user_obs_summary if available; fall back to first_seen if needed
    let rows = await env.DB.prepare(
      `SELECT species_id, first_seen FROM user_obs_summary WHERE user_login = ? AND taxon_id = ?`
    ).bind(username, parseInt(taxonId, 10)).all();

    if (!rows || !rows.results || rows.results.length === 0) {
      rows = await env.DB.prepare(
        `SELECT species_id, first_seen FROM first_seen WHERE user_login = ? AND taxon_id = ?`
      ).bind(username, parseInt(taxonId, 10)).all();
    }

    const firstSeen = {};
    const speciesSet = new Set();
    for (const r of (rows.results || [])) {
      speciesSet.add(r.species_id);
      // Normalize to ISO if possible; many rows may already be ISO or YYYY-MM-DD
      try {
        firstSeen[r.species_id] = r.first_seen ? new Date(r.first_seen).toISOString() : null;
      } catch (_) {
        firstSeen[r.species_id] = r.first_seen || null;
      }
    }

    return json({ firstSeen, species: Array.from(speciesSet) }, 200, request);
  } catch (e) {
    return json({ error: e?.message || String(e) }, 500, request);
  }
}

// POST /timeline/index  { username, taxonId }
async function timelineIndex(request, env) {
  const { login, jwt } = await requireLogin(request);
  if (!login) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { username, taxonId } = body || {};
  if (!username || !taxonId) return json({ error: 'Missing parameters: username, taxonId' }, 400, request);
  if (username !== login) return json({ error: 'Forbidden' }, 403, request);

  const authHeader = jwt ? `Bearer ${jwt}` : undefined;
  const limiterKey = authHeader || `${username}:${taxonId}:timeline`;

  // Fetch all observations under base taxon
  const observations = await fetchUserObservations(env, username, taxonId, authHeader, Infinity, limiterKey);

  let insertedEvents = 0, updatedSummaries = 0;
  const insertEvt = env.DB.prepare(
    `INSERT OR IGNORE INTO user_obs_events (user_login, taxon_id, species_id, observed_on)
     VALUES (?, ?, ?, ?)`
  );
  const upsertSum = env.DB.prepare(
    `INSERT INTO user_obs_summary (user_login, taxon_id, species_id, first_seen, last_seen)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_login, taxon_id, species_id)
     DO UPDATE SET
       first_seen = MIN(COALESCE(first_seen, excluded.first_seen), excluded.first_seen),
       last_seen  = MAX(COALESCE(last_seen,  excluded.last_seen),  excluded.last_seen)`
  );

  for (const obs of observations) {
    const taxon = obs?.taxon;
    if (!taxon?.id) continue;
    // Only index species-level leaves (and infra)
    if (!isSpeciesRank(taxon.rank)) continue;
    const sid = taxon.id;
    const iso =
      toISODateOnly(obs?.observed_on_details?.date) ||
      toISODateOnly(obs?.observed_on) ||
      toISODateOnly(obs?.time_observed_at);
    if (!iso) continue;

    const evt = await insertEvt.bind(username, parseInt(taxonId,10), sid, iso).run();
    if ((evt?.success) || (evt?.meta && evt.meta.changes > 0)) insertedEvents++;

    const sum = await upsertSum.bind(username, parseInt(taxonId,10), sid, iso, iso).run();
    if (sum?.success || (sum?.meta && sum.meta.changes > 0)) updatedSummaries++;
  }

  // Range for UI
  const row = await env.DB.prepare(
    `SELECT MIN(first_seen) AS minDate, MAX(last_seen) AS maxDate
     FROM user_obs_summary WHERE user_login=? AND taxon_id=?`
  ).bind(username, parseInt(taxonId,10)).first();

  return json({
    insertedEvents, updatedSummaries,
    minDate: row?.minDate || null,
    maxDate: row?.maxDate || null
  }, 200, request);
}

// GET /timeline/date-range?user_login=:u&taxon_id=:t
async function timelineDateRange(request, env) {
  const url = new URL(request.url);
  const { login } = await requireLogin(request);
  const user = (url.searchParams.get('user_login') || '').trim();
  const taxonId = parseInt(url.searchParams.get('taxon_id') || '', 10);
  if (!user || !Number.isFinite(taxonId)) return json({ error: 'user_login and taxon_id are required' }, 400, request);
  if (!login || login !== user) return json({ error: 'Forbidden' }, 403, request);

  const row = await env.DB.prepare(
    `SELECT MIN(first_seen) AS minDate, MAX(last_seen) AS maxDate, COUNT(*) AS speciesCount
     FROM user_obs_summary WHERE user_login=? AND taxon_id=?`
  ).bind(user, taxonId).first();
  return json({
    minDate: row?.minDate || null,
    maxDate: row?.maxDate || null,
    speciesCount: row?.speciesCount || 0
  }, 200, request);
}

// POST /timeline/tree-at-date  { username, taxonId, date }
async function timelineTreeAtDate(request, env) {
  const { login } = await requireLogin(request);
  if (!login) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { username, taxonId, date } = body || {};
  if (!username || !taxonId || !date) return json({ error: 'Missing parameters: username, taxonId, date' }, 400, request);
  if (username !== login) return json({ error: 'Forbidden' }, 403, request);

  const iso = toISODateOnly(date);
  if (!iso) return json({ error: 'Invalid date' }, 400, request);

  const q = await env.DB.prepare(
    `SELECT DISTINCT species_id FROM user_obs_events
     WHERE user_login=? AND taxon_id=? AND observed_on <= ?
     ORDER BY species_id`
  ).bind(username, parseInt(taxonId,10), iso).all();
  const speciesIds = (q.results || []).map(r => r.species_id);

  const tree = await buildTreeFromDatabase(env, speciesIds, parseInt(taxonId,10));
  const markdown = treeToMarkdown(tree);
  const plainMarkdown = toPlainMarkdown(markdown);
  return json({ markdown, plainMarkdown, speciesCount: speciesIds.length }, 200, request);
}

// GET /first-observation?username=:u&taxon_id=:t
async function firstObservation(request, env) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const taxonId = parseInt(url.searchParams.get('taxon_id') || '0', 10);
    if (!username || !taxonId) return json({ error: 'Missing parameters: username, taxon_id' }, 400, request);

    const rawAuth = request.headers.get('Authorization') || '';
    const jwt = await processAuthHeader(rawAuth);
    const authHeader = jwt ? `Bearer ${jwt}` : (rawAuth || undefined);

    const cacheKey = `firstObs:${username}:${taxonId}`;
    const cached = requestCache.get(cacheKey);
    const now = Date.now();
    const ttlMs = (RATE_LIMIT_CONFIG.cacheTTL || 300) * 1000;
    if (cached && (now - cached.timestamp) < ttlMs) {
      return json(cached.data, 200, request);
    }

    const api = new URL('https://api.inaturalist.org/v1/observations');
    api.searchParams.set('user_id', username);
    api.searchParams.set('taxon_id', String(taxonId));
    api.searchParams.set('order', 'asc');
    api.searchParams.set('order_by', 'observed_on');
    // allow all grades to increase chance of finding a photo
    api.searchParams.set('quality_grade', 'casual,needs_id,research');
    api.searchParams.set('per_page', '1');
    api.searchParams.set('page', '1');

    const headers = { 'User-Agent': 'iNat-Trees-Cloudflare/1.0' };
    if (authHeader) headers['Authorization'] = authHeader;

    await acquireLimiter(env, authHeader || `${username}:firstObs`, RATE_LIMIT_CONFIG.minGlobalGapMs);

    const r = await fetch(api.toString(), { headers });
    if (!r.ok) {
      const msg = `iNat HTTP ${r.status}`;
      if (r.status === 429) return json({ error: msg }, 429, request);
      return json({ error: msg }, 502, request);
    }
    const data = await r.json();
    const result = (data.results && data.results[0]) || null;
    if (!result) {
      const payload = { notFound: true };
      requestCache.set(cacheKey, { data: payload, timestamp: now });
      return json(payload, 200, request);
    }
    const obsId = result.id;
    const obsUrl = `https://www.inaturalist.org/observations/${obsId}`;
    const observedOn = result.observed_on || result.time_observed_at || result.created_at;
    const photo = (result.photos && result.photos[0]) || null;
    const imageUrls = photo ? {
      thumb: photo.url?.replace('square', 'thumb') || photo.url,
      small: photo.url?.replace('square', 'small') || photo.url,
      medium: photo.url?.replace('square', 'medium') || photo.url,
      large: photo.url?.replace('square', 'large') || photo.url,
      original: photo.original_url || photo.url
    } : null;
    const payload = { obs_id: obsId, obs_url: obsUrl, observed_on: observedOn, image_urls: imageUrls };
    requestCache.set(cacheKey, { data: payload, timestamp: now });
    return json(payload, 200, request);
  } catch (e) {
    return json({ error: e?.message || String(e) }, 500, request);
  }
}

function toPlainMarkdown(md) {
  return String(md)
    .replace(/<a[^>]*class=\"taxon-link\"[^>]*>(.*?)<\/a>/gi, '$1')
    .replace(/<span[^>]*>.*?<\/span>/gi, '')
    // strip custom color tokens used for markmap/text coloring
    .replace(/\{color:[^}]+\}/gi, '')
    .replace(/\{\/color\}/gi, '')
    .replace(/🖼️/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+$/gm, '');
}
// POST /timeline/precache { username, taxonId, checkpointId }
async function timelinePrecache(request, env) {
  try {
    const { login } = await requireLogin(request).catch(() => ({ login: null }));
    const body = await request.json().catch(() => ({}));
    const { username, taxonId, checkpointId } = body || {};
    if (!username || !taxonId || !checkpointId) return json({ error: 'Missing parameters' }, 400, request);
    if (login && username !== login) return json({ error: 'Forbidden' }, 403, request);

    // Determine date range from user_obs_summary
    const dr = await env.DB.prepare(
      `SELECT MIN(first_seen) AS minDate, MAX(last_seen) AS maxDate FROM user_obs_summary WHERE user_login=? AND taxon_id=?`
    ).bind(username, parseInt(taxonId,10)).first();
    let minDate = dr?.minDate, maxDate = dr?.maxDate;
    if (!minDate || !maxDate) {
      // Attempt to build timeline index once using caller's auth, then re-check
      try {
        await timelineIndex(new Request('http://local/timeline/index', { method:'POST', headers: request.headers, body: JSON.stringify({ username, taxonId }) }), env);
      } catch (_) {}
      const dr2 = await env.DB.prepare(
        `SELECT MIN(first_seen) AS minDate, MAX(last_seen) AS maxDate FROM user_obs_summary WHERE user_login=? AND taxon_id=?`
      ).bind(username, parseInt(taxonId,10)).first();
      if (!dr2?.minDate || !dr2?.maxDate) return json({ error: 'No range' }, 200, request);
      // overwrite for downstream
      minDate = dr2.minDate; maxDate = dr2.maxDate;
    }

    // Build 8 quantized dates
    const dates = (function() {
      const toISO = s => s;
      const start = new Date(minDate + 'T00:00:00Z');
      const end = new Date(maxDate + 'T00:00:00Z');
      const totalMs = Math.max(1, end - start);
      const out = [];
      for (let i = 0; i < 8; i++) {
        const frac = i / 7;
        const d = new Date(start.getTime() + frac * totalMs);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth()+1).padStart(2,'0');
        const dd = String(d.getUTCDate()).padStart(2,'0');
        out.push(`${y}-${m}-${dd}`);
      }
      return out;
    })();

    // For each date, build species set and tree markdown
    const markdowns = [];
    for (const iso of dates) {
      const q = await env.DB.prepare(
        `SELECT DISTINCT species_id FROM user_obs_events WHERE user_login=? AND taxon_id=? AND observed_on <= ? ORDER BY species_id`
      ).bind(username, parseInt(taxonId,10), iso).all();
      const speciesIds = (q.results || []).map(r => r.species_id);
      const tree = await buildTreeFromDatabase(env, speciesIds, parseInt(taxonId,10));
      markdowns.push(treeToMarkdown(tree));
    }

    // Upsert timeline_precache
    const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
    await env.DB.prepare(
      `INSERT OR REPLACE INTO timeline_precache (id, user_login, taxon_id, checkpoint_id, dates_json, markdowns_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, username, parseInt(taxonId,10), checkpointId, JSON.stringify(dates), JSON.stringify(markdowns), new Date().toISOString()).run();

    return json({ ok: true, dates, count: markdowns.length }, 200, request);
  } catch (e) {
    return json({ error: e?.message || String(e) }, 500, request);
  }
}

async function searchTaxa(request, env) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 25);
  if (!q || q.length < 2) {
    return json({ results: [] }, 200, request);
  }

  const ranks = Array.from(VALID_HIGHER_RANKS);
  const placeholders = ranks.map(() => '?').join(',');

  const likeNeedle = `%${q.toLowerCase()}%`;
  const sql = `
    SELECT taxon_id, name, rank, common_name
    FROM taxa
    WHERE (
      LOWER(name) LIKE ? OR LOWER(IFNULL(common_name, '')) LIKE ?
    )
    AND LOWER(rank) IN (${placeholders})
    LIMIT ?
  `;

  const stmt = env.DB.prepare(sql).bind(likeNeedle, likeNeedle, ...ranks.map(r => r.toLowerCase()), limit);
  const { results } = await stmt.all();

  const uniqueById = new Map();
  for (const row of results || []) {
    if (!uniqueById.has(row.taxon_id)) uniqueById.set(row.taxon_id, row);
  }

  const finalResults = Array.from(uniqueById.values()).slice(0, limit);
  return json({ results: finalResults }, 200, request);
}

// Keep all the existing helper functions unchanged
const LIFE_TAXON_ID = 48460;
const USER1_COLOR = 'red';
const USER2_COLOR = 'blue';
const SHARED_COLOR = 'purple';

const RANK_ORDER = {
  'stateofmatter': 100,
  'kingdom': 90,
  'phylum': 80,
  'subphylum': 79,
  'superclass': 78,
  'class': 70,
  'subclass': 69,
  'infraclass': 68,
  'subterclass': 67,
  'superorder': 66,
  'order': 60,
  'suborder': 59,
  'infraorder': 58,
  'parvorder': 57,
  'superfamily': 56,
  'family': 50,
  'subfamily': 49,
  'supertribe': 48,
  'tribe': 47,
  'subtribe': 46,
  'genus': 40,
  'subgenus': 39,
  'section': 38,
  'subsection': 37,
  'species': 30,
  'subspecies': 29,
  'variety': 28,
  'form': 27,
  'hybrid': 26,
  'complex': 25,
  'unknown': 0
};

function getRankOrder(rank) {
  return RANK_ORDER[(rank || '').toLowerCase()] ?? RANK_ORDER['unknown'];
}

function parseAncestorIds(value) {
  if (!value) return [];
  const s = String(value).trim();
  if (!s.startsWith('{') || !s.endsWith('}')) return [];
  const inner = s.slice(1, -1).replace(/\s+/g, '');
  if (!inner) return [];
  return inner.split(',').map(v => parseInt(v, 10)).filter(n => Number.isFinite(n));
}

async function fetchTaxonById(env, id) {
  const sql = `SELECT taxon_id, name, rank, common_name, ancestor_ids FROM taxa WHERE taxon_id = ? LIMIT 1`;
  const row = await env.DB.prepare(sql).bind(id).first();
  return row || null;
}

// Choose the start root as the parent of the requested base taxon (fallback to Life)
async function resolveStartRoot(env, baseTaxonId) {
  // Default to Life
  const lifeNode = { id: LIFE_TAXON_ID, name: 'Life', rank: 'stateofmatter', common_name: 'Life' };

  const base = await fetchTaxonById(env, baseTaxonId).catch(() => null);
  if (!base) return { startId: LIFE_TAXON_ID, startNode: lifeNode };

  // Ensure the ancestor list begins at Life
  let anc = parseAncestorIds(base.ancestor_ids);
  if (anc.length === 0 || anc[0] !== LIFE_TAXON_ID) {
    anc = [LIFE_TAXON_ID, ...anc.filter(id => id !== LIFE_TAXON_ID)];
  }

  // Parent = last ID in the ancestor chain (just above the base taxon)
  const parentId = anc.length ? anc[anc.length - 1] : LIFE_TAXON_ID;
  if (parentId === LIFE_TAXON_ID) {
    return { startId: LIFE_TAXON_ID, startNode: lifeNode };
  }

  const parent = await fetchTaxonById(env, parentId).catch(() => null);
  if (!parent) return { startId: LIFE_TAXON_ID, startNode: lifeNode };

  return {
    startId: parent.taxon_id || parent.id || parentId,
    startNode: parent
  };
}

async function fetchTaxaByIds(env, ids) {
  if (!ids || ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const sql = `SELECT taxon_id, name, rank, common_name FROM taxa WHERE taxon_id IN (${placeholders})`;
  const { results } = await env.DB.prepare(sql).bind(...ids).all();
  return results || [];
}

function generateComparisonStats(user1TaxonIds, user2TaxonIds) {
  const user1Set = new Set(user1TaxonIds);
  const user2Set = new Set(user2TaxonIds);
  const user1Only = user1TaxonIds.filter(id => !user2Set.has(id)).length;
  const user2Only = user2TaxonIds.filter(id => !user1Set.has(id)).length;
  const shared = user1TaxonIds.filter(id => user2Set.has(id)).length;
  return { user1Total: user1TaxonIds.length, user2Total: user2TaxonIds.length, user1Only, user2Only, shared };
}

async function buildComparisonTree(env, user1TaxonIds, user2TaxonIds, baseTaxonId) {
  const user1Set = new Set(user1TaxonIds);
  const user2Set = new Set(user2TaxonIds);
  const user1OnlyTaxa = new Set(user1TaxonIds.filter(id => !user2Set.has(id)));
  const user2OnlyTaxa = new Set(user2TaxonIds.filter(id => !user1Set.has(id)));

  const { startId, startNode } = await resolveStartRoot(env, baseTaxonId);
  const root = {
    id: startId,
    name: startNode.name || 'Life',
    rank: startNode.rank || 'stateofmatter',
    common_name: startNode.common_name || (startId === LIFE_TAXON_ID ? 'Life' : ''),
    color: SHARED_COLOR,
    children: {}
  };
  const added = new Set([startId]);

  let baseTaxon = await fetchTaxonById(env, baseTaxonId);
  if (baseTaxon) {
    const anc = parseAncestorIds(baseTaxon.ancestor_ids);
    if (anc.length === 0 || anc[0] !== LIFE_TAXON_ID) {
      baseTaxon.ancestor_ids = `{${[LIFE_TAXON_ID, ...anc].join(',')}}`;
    }
  }

  const allIds = Array.from(new Set([...user1TaxonIds, ...user2TaxonIds]));
  for (const taxonId of allIds) {
    if (added.has(taxonId)) continue;
    const taxon = await fetchTaxonById(env, taxonId);
    if (!taxon) continue;

    let color = SHARED_COLOR;
    if (user1OnlyTaxa.has(taxonId)) color = USER1_COLOR;
    else if (user2OnlyTaxa.has(taxonId)) color = USER2_COLOR;

    let ancestorIds = parseAncestorIds(taxon.ancestor_ids);
    if ((ancestorIds.length === 0) && baseTaxon) {
      const baseAnc = parseAncestorIds(baseTaxon.ancestor_ids);
      ancestorIds = [...baseAnc, baseTaxonId];
    }
    if (ancestorIds.length === 0 || ancestorIds[0] !== LIFE_TAXON_ID) {
      ancestorIds = [LIFE_TAXON_ID, ...ancestorIds.filter(id => id !== LIFE_TAXON_ID)];
    }
    ancestorIds = Array.from(new Set(ancestorIds));

    // Trim everything above the new root (startId)
    const idx = ancestorIds.indexOf(startId);
    const path = idx >= 0 ? ancestorIds.slice(idx) : [startId, ...ancestorIds];

    let current = root;
    if (path.length > 0) {
      const ancestorRows = await fetchTaxaByIds(env, path);
      const map = new Map(ancestorRows.map(a => [a.taxon_id, a]));
      for (const ancId of path) {
        if (ancId === startId) continue;
        const anc = map.get(ancId);
        if (!anc) continue;
        if (!current.children[ancId]) {
          current.children[ancId] = { id: anc.taxon_id, name: anc.name, rank: anc.rank, common_name: anc.common_name || '', color, children: {} };
        } else if (current.children[ancId].color !== color && current.children[ancId].color !== SHARED_COLOR) {
          current.children[ancId].color = SHARED_COLOR;
        }
        current = current.children[ancId];
      }
    }

    if (!current.children[taxonId]) {
      current.children[taxonId] = { id: taxon.taxon_id, name: taxon.name, rank: taxon.rank, common_name: taxon.common_name || '', color, children: {}, user1Has: user1Set.has(taxonId), user2Has: user2Set.has(taxonId) };
    } else {
      if (current.children[taxonId].color !== color && current.children[taxonId].color !== SHARED_COLOR) {
        current.children[taxonId].color = SHARED_COLOR;
      }
      current.children[taxonId].user1Has = current.children[taxonId].user1Has || user1Set.has(taxonId);
      current.children[taxonId].user2Has = current.children[taxonId].user2Has || user2Set.has(taxonId);
    }
    added.add(taxonId);
  }
  return root;
}

async function buildTreeFromDatabase(env, speciesTaxonIds, baseTaxonId) {
  const { startId, startNode } = await resolveStartRoot(env, baseTaxonId);
  const root = {
    id: startId,
    name: startNode.name || 'Life',
    rank: startNode.rank || 'stateofmatter',
    common_name: startNode.common_name || (startId === LIFE_TAXON_ID ? 'Life' : ''),
    children: {}
  };
  const added = new Set([startId]);

  let baseTaxon = await fetchTaxonById(env, baseTaxonId);
  if (baseTaxon) {
    const anc = parseAncestorIds(baseTaxon.ancestor_ids);
    if (anc.length === 0 || anc[0] !== LIFE_TAXON_ID) {
      baseTaxon.ancestor_ids = `{${[LIFE_TAXON_ID, ...anc].join(',')}}`;
    }
  }

  for (const taxonId of speciesTaxonIds) {
    if (added.has(taxonId)) continue;
    const taxon = await fetchTaxonById(env, taxonId);
    if (!taxon) continue;

    let ancestorIds = parseAncestorIds(taxon.ancestor_ids);
    if ((ancestorIds.length === 0) && baseTaxon) {
      const baseAnc = parseAncestorIds(baseTaxon.ancestor_ids);
      ancestorIds = [...baseAnc, baseTaxonId];
    }
    if (ancestorIds.length === 0 || ancestorIds[0] !== LIFE_TAXON_ID) {
      ancestorIds = [LIFE_TAXON_ID, ...ancestorIds.filter(id => id !== LIFE_TAXON_ID)];
    }
    ancestorIds = Array.from(new Set(ancestorIds));

    // Trim everything above the new root (startId)
    const idx = ancestorIds.indexOf(startId);
    const path = idx >= 0 ? ancestorIds.slice(idx) : [startId, ...ancestorIds];

    let current = root;
    if (path.length > 0) {
      const ancestorRows = await fetchTaxaByIds(env, path);
      const map = new Map(ancestorRows.map(a => [a.taxon_id, a]));
      for (const ancId of path) {
        if (ancId === startId) continue; // we already ARE at the trimmed root
        const anc = map.get(ancId);
        if (!anc) continue;
        if (!current.children[ancId]) {
          current.children[ancId] = { id: anc.taxon_id, name: anc.name, rank: anc.rank, common_name: anc.common_name || '', children: {} };
        }
        current = current.children[ancId];
      }
    }

    if (!current.children[taxonId]) {
      current.children[taxonId] = { id: taxon.taxon_id, name: taxon.name, rank: taxon.rank, common_name: taxon.common_name || '', children: {} };
    }
    added.add(taxonId);
  }
  return root;
}

function treeToMarkdown(node, level = 0, ctx = {}) {
  const indent = '  '.repeat(level);
  let colorStart = '';
  let colorEnd = '';
  if (node.color) { colorStart = `{color:${node.color}}`; colorEnd = '{/color}'; }

  const taxonUrl = node.id ? `https://www.inaturalist.org/taxa/${node.id}` : '#';
  const nameHtml = `<a class="taxon-link" href="${taxonUrl}" target="_blank" rel="noopener">${escapeHtml(node.name)}</a>`;
  const common = node.common_name ? ` <span class="mm-common">(${escapeHtml(node.common_name)})</span>` : '';
  const shortRank = shortRankCode(node.rank);
  const rankChip = shortRank ? ` <span class="mm-badge mm-rank" title="${escapeHtml(node.rank)}">${shortRank}</span>` : '';
  const countChip = Number.isFinite(node.sppCount) ? ` <span class="mm-badge mm-count" title="Distinct species in this branch">${node.sppCount} spp</span>` : '';
  const isSpecies = (node.rank || '').toLowerCase() === 'species';
  let photoChips = '';
  if (isSpecies) {
    if (ctx.mode === 'compare') {
      if (node.user1Has && ctx.username1) photoChips += ` <a href="#" class="mm-badge mm-photo first-obs-trigger user1" data-taxon-id="${node.id}" data-username="${ctx.username1}" title="First RG photo for ${escapeHtml(ctx.username1)}">🖼️</a>`;
      if (node.user2Has && ctx.username2) photoChips += ` <a href="#" class="mm-badge mm-photo first-obs-trigger user2" data-taxon-id="${node.id}" data-username="${ctx.username2}" title="First RG photo for ${escapeHtml(ctx.username2)}">🖼️</a>`;
    } else if (ctx.username) {
      photoChips = ` <a href="#" class="mm-badge mm-photo first-obs-trigger user1" data-taxon-id="${node.id}" data-username="${ctx.username}" title="First research‑grade photo">🖼️</a>`;
    }
  }

  let line = `${indent}- ${colorStart}${nameHtml}${common}${rankChip}${countChip}${photoChips}${colorEnd}`;
  let md = line + '\n';
  if (node.children && Object.keys(node.children).length > 0) {
    const children = Object.values(node.children).sort((a,b) => {
      const ra = getRankOrder(a.rank); const rb = getRankOrder(b.rank);
      if (ra !== rb) return rb - ra; // higher ranks first
      return (a.name || '').localeCompare(b.name || '');
    });
    for (const child of children) md += treeToMarkdown(child, level + 1, ctx);
  }
  return md;
}

function shortRankCode(rank) {
  if (!rank) return '';
  const r = String(rank).toLowerCase();
  const map = { kingdom: 'K', phylum: 'P', class: 'C', order: 'O', family: 'F', genus: 'G', species: 'S' };
  return map[r] || '';
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }