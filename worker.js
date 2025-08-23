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
  const markdown = treeToMarkdown(tree);

  return json({ markdown, stats, user1Count: user1TaxonIds.length, user2Count: user2TaxonIds.length }, 200, request);
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
    const markdown = treeToMarkdown(tree);
    return json({ markdown, speciesTaxonIds: speciesIds, rankCounts, highWatermarkUpdatedAt: highWatermark, auth: { received: hadAuthHeader, usableJWT: !!jwt } }, 200, request, debugHeaders);
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
}

function uuidv4() {
  const rnd = crypto.getRandomValues(new Uint8Array(16));
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  const hex = Array.from(rnd, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

async function saveCheckpoint(request, env) {
  const rawAuth = request.headers.get('Authorization') || '';
  const jwt = await processAuthHeader(rawAuth);
  if (!jwt) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { username, taxonId, taxonName, speciesTaxonIds, rankCounts, highWatermarkUpdatedAt } = body || {};
  if (!username || !taxonId || !Array.isArray(speciesTaxonIds)) {
    return json({ error: 'Missing parameters: username, taxonId, speciesTaxonIds' }, 400, request);
  }
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
  return json({ id, createdAt }, 200, request);
}

async function listCheckpoints(request, env) {
  const url = new URL(request.url);
  const user = (url.searchParams.get('user_login') || '').trim();
  const taxonId = url.searchParams.get('taxon_id');
  const include = url.searchParams.get('include') || 'meta';
  if (!user) return json({ error: 'user_login is required' }, 400, request);
  let sql = `SELECT id, user_login, taxon_id, taxon_name, created_at`;
  if (include === 'full') sql += `, species_ids_json, rank_counts_json, high_watermark_updated_at`;
  sql += ` FROM checkpoints WHERE user_login = ?`;
  const binds = [user];
  if (taxonId) { sql += ' AND taxon_id = ?'; binds.push(parseInt(taxonId, 10)); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ checkpoints: results || [] }, 200, request);
}

async function deleteCheckpoint(request, env) {
  const rawAuth = request.headers.get('Authorization') || '';
  const jwt = await processAuthHeader(rawAuth);
  if (!jwt) return json({ error: 'Unauthorized' }, 401, request);
  const body = await request.json().catch(() => ({}));
  const { id } = body || {};
  if (!id) return json({ error: 'Missing parameters: id' }, 400, request);
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
    return json({ markdown }, 200, request);
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
    const rawAuth = request.headers.get('Authorization') || '';
    const jwt = await processAuthHeader(rawAuth);
    const authHeader = jwt ? `Bearer ${jwt}` : undefined;
    const body = await request.json();
    const { username, taxonId } = body || {};
    if (!username || !taxonId) return json({ error: 'Missing parameters: username, taxonId' }, 400, request);
    // Try to read cached first_seen
    const cachedRows = await env.DB.prepare(`SELECT species_id, first_seen FROM first_seen WHERE user_login = ? AND taxon_id = ?`).bind(username, parseInt(taxonId, 10)).all();
    const cachedMap = new Map((cachedRows.results || []).map(r => [r.species_id, r.first_seen]));
    // Always compute fresh, then upsert cache
    const observations = await fetchUserObservations(env, username, taxonId, authHeader, Infinity, authHeader || `${username}:${taxonId}`);
    const firstSeen = {};
    const speciesSet = new Set();
    for (const obs of observations) {
      if (!obs || !obs.taxon || !obs.taxon.id) continue;
      const sid = obs.taxon.id;
      speciesSet.add(sid);
      const dateIso = (obs.observed_on_details && obs.observed_on_details.date)
        ? new Date(obs.observed_on_details.date).toISOString()
        : (obs.observed_on ? new Date(obs.observed_on).toISOString() : null);
      if (!firstSeen[sid]) firstSeen[sid] = dateIso;
      else if (dateIso && firstSeen[sid] && dateIso < firstSeen[sid]) firstSeen[sid] = dateIso;
    }
    // Upsert cache
    const ins = env.DB.prepare(`INSERT OR REPLACE INTO first_seen (user_login, taxon_id, species_id, first_seen) VALUES (?, ?, ?, ?)`);
    for (const [sidStr, dt] of Object.entries(firstSeen)) {
      const sid = parseInt(sidStr, 10);
      await ins.bind(username, parseInt(taxonId, 10), sid, dt || null).run();
    }
    return json({ firstSeen: Object.fromEntries(Object.entries(firstSeen)), species: Array.from(speciesSet) }, 200, request);
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

  const root = { id: LIFE_TAXON_ID, name: 'Life', rank: 'stateofmatter', common_name: 'Life', color: SHARED_COLOR, children: {} };
  const added = new Set([LIFE_TAXON_ID]);

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

    let current = root;
    if (ancestorIds.length > 0) {
      const ancestorRows = await fetchTaxaByIds(env, ancestorIds);
      const map = new Map(ancestorRows.map(a => [a.taxon_id, a]));
      for (const ancId of ancestorIds) {
        if (ancId === LIFE_TAXON_ID) continue;
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
      current.children[taxonId] = { id: taxon.taxon_id, name: taxon.name, rank: taxon.rank, common_name: taxon.common_name || '', color, children: {} };
    } else if (current.children[taxonId].color !== color && current.children[taxonId].color !== SHARED_COLOR) {
      current.children[taxonId].color = SHARED_COLOR;
    }
    added.add(taxonId);
  }
  return root;
}

async function buildTreeFromDatabase(env, speciesTaxonIds, baseTaxonId) {
  const root = { id: LIFE_TAXON_ID, name: 'Life', rank: 'stateofmatter', common_name: 'Life', children: {} };
  const added = new Set([LIFE_TAXON_ID]);

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

    let current = root;
    if (ancestorIds.length > 0) {
      const ancestorRows = await fetchTaxaByIds(env, ancestorIds);
      const map = new Map(ancestorRows.map(a => [a.taxon_id, a]));
      for (const ancId of ancestorIds) {
        if (ancId === LIFE_TAXON_ID) continue;
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

function treeToMarkdown(node, level = 0) {
  const indent = '  '.repeat(level);
  let colorStart = '';
  let colorEnd = '';
  if (node.color) {
    colorStart = `{color:${node.color}}`;
    colorEnd = '{/color}';
  }
  let line = `${indent}- ${colorStart}${node.name}`;
  if (node.common_name) line += ` (${node.common_name})`;
  if (node.rank && node.rank !== 'no rank') line += ` [${node.rank}]`;
  line += colorEnd;
  let md = line + '\n';
  if (node.children && Object.keys(node.children).length > 0) {
    const children = Object.values(node.children).sort((a, b) => {
      const ra = getRankOrder(a.rank);
      const rb = getRankOrder(b.rank);
      if (ra !== rb) return rb - ra;
      return (a.name || '').localeCompare(b.name || '');
    });
    for (const child of children) {
      md += treeToMarkdown(child, level + 1);
    }
  }
  return md;
}