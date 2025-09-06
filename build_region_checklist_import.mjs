// build_region_checklist_import.mjs
// Usage examples:
//   node build_region_checklist_import.mjs "C:\\path\\Massachusetts-Check-List.taxonomic.csv" .\\out --region-code=US-MA --region-name=Massachusetts --country=US --type=state
//   node build_region_checklist_import.mjs .\\csvs .\\out --max-rows=5000
//
// Requires: npm i csv-parse
// Node 18+ (uses global fetch)

import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// ================== HARD-CODED SECRETS / ENDPOINTS ==================
const JWT_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjozODQ3MTgsImV4cCI6MTc1NzIwMDYyM30.C4B_QLxOaqIa3FqIg02UOX38_kt8gZzDuAZexYIqBOo_brp7bFJU1TZlcGiqPqTOphfY4VlUu9f1FC5ReVvySA";
// If you’ve added the Worker helper route /taxa/resolve, put its base URL here.
// Leave empty "" to skip Worker-assisted lookups.
const WORKER_URL = ""; // e.g., "https://inat-trees-worker.yourdomain.workers.dev"

// ================== CLI ARGS & PATHS ==================
const INPUT = process.argv[2] || "./csvs";
const OUT_DIR = process.argv[3] || "./out";
await fs.mkdir(OUT_DIR, { recursive: true });

// simple arg getter
const arg = (name, def = undefined) => {
  const x = process.argv.find(a => a.startsWith(`--${name}=`));
  if (!x) return def;
  const val = x.slice(name.length + 3);
  if (val === "true") return true;
  if (val === "false") return false;
  const n = Number(val);
  return Number.isFinite(n) && String(n) === val ? n : val;
};

const MAX_ROWS = arg("max-rows", 0); // limit for testing
const REGION_OVERRIDE = {
  code: arg("region-code"),
  name: arg("region-name"),
  country: arg("country"),
  type: arg("type"),
};
const HAS_REGION_OVERRIDE = !!(REGION_OVERRIDE.code && REGION_OVERRIDE.name && REGION_OVERRIDE.country && REGION_OVERRIDE.type);

// ================== CONFIG ==================
const ISO_RE = /^(US|CA)-[A-Z]{2}$/;
const ACCEPT_RANKS = new Set(["species", "subspecies", "variety", "form"]);
const INITIAL_SLEEP_MS = 500;
const MAX_SLEEP_MS = 8000;
const cachePath = path.join(OUT_DIR, "taxon_cache.json");

// utils
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const sanitize = (v) => (v == null ? null : String(v).replace(/\u0000/g, "").trim());
const sql = (v) => (v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const chunk = (arr, n) => { const out = []; for (let i=0;i<arr.length;i+=n) out.push(arr.slice(i, i+n)); return out; };

// load/prepare cache
let taxonCache = {};
try { taxonCache = JSON.parse(await fs.readFile(cachePath, "utf8")); } catch {}

// ================== REGION INFERENCE ==================
function inferRegionFromFilename(file) {
  if (HAS_REGION_OVERRIDE) return REGION_OVERRIDE;
  const stem = path.basename(file, path.extname(file));
  if (ISO_RE.test(stem)) {
    const [country] = stem.split("-");
    return { code: stem, name: stem, country, type: country === "US" ? "state" : "province" };
  }
  throw new Error(`Cannot infer region for "${file}". Either rename to ISO (US-XX.csv) or pass --region-code/--region-name/--country/--type`);
}

// ================== WORKER BULK RESOLVE (optional) ==================
async function workerResolve(names) {
  if (!WORKER_URL || !Array.isArray(names) || names.length === 0) return {};
  const map = {};
  for (const part of chunk(names, 400)) {
    const r = await fetch(`${WORKER_URL}/taxa/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: part, ranks: ["species","subspecies","variety","form"] }),
    }).catch(() => null);
    if (!r || !r.ok) continue;
    const j = await r.json().catch(() => ({}));
    const m = j?.results || {};
    for (const [k, v] of Object.entries(m)) map[k.toLowerCase()] = v;
  }
  return map;
}

// ================== INAT RESOLVE (JWT + backoff) ==================
async function resolveTaxonIdINat(scientificName, backoff = INITIAL_SLEEP_MS) {
  const key = scientificName.toLowerCase();
  if (taxonCache[key]) return taxonCache[key];

  const url = new URL("https://api.inaturalist.org/v1/taxa");
  url.searchParams.set("q", scientificName);
  url.searchParams.set("is_active", "true");
  url.searchParams.set("per_page", "10");

  const headers = { "Accept": "application/json" };
  if (JWT_TOKEN) headers["Authorization"] = `Bearer ${JWT_TOKEN}`;

  let r;
  try { r = await fetch(url, { headers }); } catch { r = null; }

  if (!r) {
    const next = Math.min(backoff * 2, MAX_SLEEP_MS);
    await sleep(backoff);
    return resolveTaxonIdINat(scientificName, next);
  }

  if (r.status === 429) {
    const ra = Number(r.headers.get("Retry-After"));
    const wait = Number.isFinite(ra) ? Math.min(ra * 1000, MAX_SLEEP_MS) : Math.min(backoff * 2, MAX_SLEEP_MS);
    console.warn("429 rate limit:", scientificName, "→ waiting", wait, "ms");
    await sleep(wait);
    return resolveTaxonIdINat(scientificName, Math.min(wait * 2, MAX_SLEEP_MS));
  }

  if (!r.ok) {
    console.warn("Lookup failed", r.status, scientificName);
    return null;
  }

  const j = await r.json().catch(() => ({}));
  const results = Array.isArray(j?.results) ? j.results : [];
  let best = results.find(t => (t.rank || "").toLowerCase() === "species" && String(t.name).toLowerCase() === key);
  if (!best) best = results.find(t => ACCEPT_RANKS.has((t.rank || "").toLowerCase()));

  if (best?.id) {
    taxonCache[key] = best.id;
    return best.id;
  }
  console.warn("No match:", scientificName);
  return null;
}

// top-level resolver: cache → worker → iNat
async function resolveTaxonId(scientificName, workerPrimedMap) {
  if (!scientificName) return null;
  const key = scientificName.toLowerCase();
  if (taxonCache[key]) return taxonCache[key];
  if (workerPrimedMap && workerPrimedMap[key]) {
    taxonCache[key] = workerPrimedMap[key];
    return workerPrimedMap[key];
  }
  return await resolveTaxonIdINat(scientificName);
}

// ================== SQL BATCHERS ==================
const regionRows = new Set();
const checklistBatches = [];
let batch = [];
function pushRow(sqlRow) {
  batch.push(sqlRow);
  if (batch.length >= 1000) { checklistBatches.push(batch); batch = []; }
}

// ================== INPUT DISCOVERY ==================
async function listCSVFiles(input) {
  const stat = await fs.stat(input);
  if (stat.isFile()) return [input];
  const files = (await fs.readdir(input))
    .filter(f => f.toLowerCase().endsWith(".csv"))
    .map(f => path.join(input, f))
    .sort();
  return files;
}

const files = await listCSVFiles(INPUT);
if (!files.length) {
  console.error("No CSV files found at", INPUT);
  process.exit(1);
}

console.log(`Found ${files.length} CSV file(s)`);

for (const file of files) {
  const region = inferRegionFromFilename(file);
  regionRows.add(`INSERT OR IGNORE INTO regions (code,name,country,type) VALUES (${sql(region.code)},${sql(region.name)},${sql(region.country)},${sql(region.type)});`);

  const raw = await fs.readFile(file);
  const allRows = parse(raw, { columns: true, skip_empty_lines: true });
  const rows = (MAX_ROWS && MAX_ROWS > 0) ? allRows.slice(0, MAX_ROWS) : allRows;

  console.log(`Processing ${path.basename(file)} (${rows.length}/${allRows.length}) → ${region.code}`);

  // Bulk prime from Worker (if configured)
  const uniqueNames = [...new Set(rows.map(r => sanitize(r.taxon_name)).filter(Boolean).map(s => s.toLowerCase()))];
  const workerMap = await workerResolve(uniqueNames).catch(() => ({}));

  let processed = 0;
  for (const r of rows) {
    const taxonName = sanitize(r.taxon_name);
    if (!taxonName) continue;

    const id = await resolveTaxonId(taxonName, workerMap);
    if (!id) continue;

    const occurrence_status   = sanitize(r.occurrence_status);
    const establishment_means = sanitize(r.establishment_means);
    const first_obs_url       = sanitize(r.first_observation);
    const last_obs_url        = sanitize(r.last_observation);
    const listed_taxa_url     = sanitize(r.url);
    const created_at          = sanitize(r.created_at);
    const updated_at          = sanitize(r.updated_at);

    pushRow(
`INSERT OR IGNORE INTO region_checklist
  (region_code,species_id,occurrence_status,establishment_means,first_obs_url,last_obs_url,listed_taxa_url,created_at,updated_at)
  VALUES (${sql(region.code)},${id},${sql(occurrence_status)},${sql(establishment_means)},${sql(first_obs_url)},${sql(last_obs_url)},${sql(listed_taxa_url)},${sql(created_at)},${sql(updated_at)});`
    );

    processed++;
    if (processed % 500 === 0) {
      await fs.writeFile(cachePath, JSON.stringify(taxonCache, null, 2));
      console.log(`  cached ${processed}/${rows.length}`);
    }
  }

  await fs.writeFile(cachePath, JSON.stringify(taxonCache, null, 2));
}

// flush tail
if (batch.length) { checklistBatches.push(batch); batch = []; }

// write SQL outputs
const regionsSQL = `BEGIN TRANSACTION;
${[...regionRows].join("\n")}
COMMIT;`;
await fs.writeFile(path.join(OUT_DIR, "regions.sql"), regionsSQL, "utf8");

const checklistSQL = checklistBatches.map(b => `BEGIN TRANSACTION;\n${b.join("\n")}\nCOMMIT;`).join("\n");
await fs.writeFile(path.join(OUT_DIR, "region_checklist.sql"), checklistSQL, "utf8");

console.log("Done.");
console.log("  Regions SQL:        " + path.join(OUT_DIR, "regions.sql"));
console.log("  Region checklist:   " + path.join(OUT_DIR, "region_checklist.sql"));
console.log("  Taxon cache:        " + cachePath);
