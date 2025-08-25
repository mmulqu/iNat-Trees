import { getAuthHeaders, fetchCurrentUser } from './auth.js';
let CURRENT_USER = localStorage.getItem('inat_username') || null;
let currentTaxonId = null, currentDates = [], debounceTimer = null;

const API_BASE = window.CF_API_BASE;
const listUrl = `${API_BASE}/checkpoints/list`;
const saveUrl = `${API_BASE}/checkpoints/save`;
const deleteUrl = `${API_BASE}/checkpoints/delete`;
const treeFromSpeciesUrl = `${API_BASE}/tree-from-species`;
const firstSeenUrl = `${API_BASE}/timeline/first-seen`;

function fmtDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

// ===== Simple local cache (LRU in localStorage) =====
const CP_CACHE_INDEX_KEY = 'cp_cache_index_v1';
const CP_CACHE_PREFIX = 'cp_cache_v1:';
const CP_CACHE_MAX = 50; // max cached trees
const CP_CACHE_BYTES_MAX = 4 * 1024 * 1024; // ~4MB budget

function cpCacheKeyForCheckpoint(cpId, taxonId, userLogin, thresholdIso) {
  return `${CP_CACHE_PREFIX}user:${userLogin}:taxon:${taxonId}:checkpoint:${cpId}${thresholdIso ? `:threshold:${thresholdIso}` : ''}`;
}
function cpCacheKeyForDate(taxonId, userLogin, isoDate) {
  return `${CP_CACHE_PREFIX}user:${userLogin}:taxon:${taxonId}:date:${isoDate}`;
}
function cpCacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    // move to front of index
    const idx = JSON.parse(localStorage.getItem(CP_CACHE_INDEX_KEY) || '[]').filter(k => k !== key);
    idx.unshift(key);
    localStorage.setItem(CP_CACHE_INDEX_KEY, JSON.stringify(idx.slice(0, CP_CACHE_MAX)));
    return obj?.markdown || null;
  } catch { return null; }
}
function cpCacheSet(key, markdown) {
  try {
    localStorage.setItem(key, JSON.stringify({ markdown, ts: Date.now() }));
    let idx = JSON.parse(localStorage.getItem(CP_CACHE_INDEX_KEY) || '[]').filter(k => k !== key);
    idx.unshift(key);
    // evict overflow by count first
    while (idx.length > CP_CACHE_MAX) {
      const evict = idx.pop();
      try { localStorage.removeItem(evict); } catch {}
    }
    // evict overflow by approximate byte size
    const sizeOf = k => {
      try { const v = localStorage.getItem(k); return v ? v.length : 0; } catch { return 0; }
    };
    let total = 0;
    for (const k of idx) total += sizeOf(k);
    while (total > CP_CACHE_BYTES_MAX && idx.length > 0) {
      const evict = idx.pop();
      try { const len = sizeOf(evict); localStorage.removeItem(evict); total -= len; } catch {}
    }
    localStorage.setItem(CP_CACHE_INDEX_KEY, JSON.stringify(idx));
  } catch {}
}

// ===== Checkpoint tabs (like Explore) =====
function ensureCpTab(tabId, title) {
  const tabs = document.getElementById('cpTreeTabs');
  const content = document.getElementById('cpTreeTabContent');
  let link = document.getElementById(`${tabId}-tab`);
  let pane = document.getElementById(`${tabId}-content`);
  if (!link) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
      <a class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" href="#${tabId}-content" role="tab" aria-controls="${tabId}-content" aria-selected="false">
        <span class="tab-title">${title}</span>
      </a>`;
    tabs.appendChild(li);
    link = li.querySelector('a');
  }
  if (!pane) {
    pane = document.createElement('div');
    pane.className = 'tab-pane fade';
    pane.id = `${tabId}-content`;
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', `${tabId}-tab`);
    const svgWrap = document.createElement('div');
    svgWrap.className = 'markmap-container';
    svgWrap.innerHTML = `<svg id="${tabId}-svg" style="width:100%; height:700px;"></svg>`;
    pane.appendChild(svgWrap);
    content.appendChild(pane);
  }
  // update title if changed
  try { link.querySelector('.tab-title').textContent = title; } catch {}
  // activate
  try { new bootstrap.Tab(link).show(); } catch {}
  return document.getElementById(`${tabId}-svg`);
}
function renderMarkdownToTab(tabId, markdown) {
  const svg = document.getElementById(`${tabId}-svg`);
  if (!svg) return;
  svg.innerHTML = '';
  const { Transformer, Markmap } = window.markmap || {};
  if (!Transformer || !Markmap) return;
  const transformer = new Transformer();
  const { root } = transformer.transform(markdown);
  Markmap.create(svg, null, root);
}

async function fetchCheckpoints(userLogin) {
  const url = new URL(listUrl);
  url.searchParams.set('user_login', userLogin);
  url.searchParams.set('include', 'full');
  const r = await fetch(url, { headers: { ...getAuthHeaders() }});
  if (!r.ok) throw new Error('Failed to list checkpoints');
  const data = await r.json();
  return data.checkpoints || [];
}

function groupByTaxon(checkpoints) {
  const map = new Map();
  for (const cp of checkpoints) {
    const key = String(cp.taxon_id);
    if (!map.has(key)) map.set(key, { taxonId: cp.taxon_id, taxonName: cp.taxon_name || `Taxon ${cp.taxon_id}`, items: [] });
    map.get(key).items.push(cp);
  }
  for (const g of map.values()) {
    g.items.sort((a,b) => (a.created_at < b.created_at ? -1 : 1));
  }
  return Array.from(map.values()).sort((a,b) => a.taxonName.localeCompare(b.taxonName));
}

function renderTaxaList(groups) {
  const list = document.getElementById('checkpointTaxaList');
  list.innerHTML = '';
  for (const g of groups) {
    const a = document.createElement('button');
    a.type = 'button';
    a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
    a.textContent = `${g.taxonName}`;
    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary rounded-pill';
    badge.textContent = g.items.length;
    a.appendChild(badge);
    a.addEventListener('click', () => selectTaxonGroup(g));
    list.appendChild(a);
  }
}

function selectTaxonGroup(group) {
  window.__cpSelectedGroup = group;
  const title = document.getElementById('checkpointSelectedTitle');
  title.textContent = `${group.taxonName} — ${group.items.length} checkpoints`;
  // Initialize real-date timeline for this taxon as well
  initTimelineForTaxon(group.taxonId, group.taxonName || `Taxon ${group.taxonId}`).catch(console.error);
  const slider = document.getElementById('checkpointSlider');
  slider.disabled = false;
  slider.min = 0;
  slider.max = Math.max(0, group.items.length - 1);
  slider.value = slider.max;
  slider.step = 1;
  document.getElementById('checkpointStart').textContent = fmtDate(group.items[0]?.created_at);
  document.getElementById('checkpointEnd').textContent = fmtDate(group.items[group.items.length - 1]?.created_at);
  document.getElementById('requeryCompareBtn').disabled = false;
  renderCheckpointSummary(group, Number(slider.value));
  // Immediately render the selected checkpoint tree
  renderCheckpointTree(group, Number(slider.value)).catch(console.error);
  // Ensure the visualization card is visible alongside the timeline
  try {
    const cpCard = document.getElementById('cpResultsCard');
    if (cpCard) {
      cpCard.style.display = 'block';
      try { cpCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
    }
  } catch (_) {}
  // Ensure drag and click both update
  const sync = () => { renderCheckpointSummary(group, Number(slider.value)); renderCheckpointTree(group, Number(slider.value)); };
  slider.oninput = (e) => {
    const frac = Number(slider.value) / Math.max(1, (group.items.length - 1));
    const start = new Date(group.items[0]?.created_at);
    const end = new Date(group.items[group.items.length - 1]?.created_at);
    if (isFinite(start) && isFinite(end)) {
      const t = new Date(start.getTime() + frac * (end.getTime() - start.getTime()));
      slider.dataset.thresholdDate = t.toISOString();
    }
    sync();
  };
  slider.onchange = slider.oninput;
  slider.addEventListener('click', (e) => {
    // Map click position to nearest index
    const rect = slider.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(pct * (group.items.length - 1));
    slider.value = String(idx);
    sync();
  });
  document.getElementById('requeryCompareBtn').onclick = async () => {
    const sel = group.items[Number(slider.value)];
    const btn = document.getElementById('requeryCompareBtn');
    const spn = document.getElementById('requerySpinner');
    btn.disabled = true; if (spn) spn.classList.remove('d-none');
    // For now, just refetch build-taxonomy to show current state
    const payload = {
      username: localStorage.getItem('inat_username') || '',
      taxonId: group.taxonId
    };
    const r = await fetch(`${API_BASE}/build-taxonomy`, { method:'POST', headers: { 'Content-Type':'application/json', ...getAuthHeaders() }, body: JSON.stringify(payload) });
    const res = await r.json();
    const newest = new Set((res.speciesTaxonIds || []));
    const previous = JSON.parse(sel.species_ids_json || '[]');
    const prevSet = new Set(previous);
    const added = Array.from(newest).filter(id => !prevSet.has(id));
    const div = document.getElementById('checkpointSummary');
    div.innerHTML = `<div class="alert alert-info">Compared to ${fmtDate(sel.created_at)}: +${added.length} species</div>`;
    btn.disabled = false; if (spn) spn.classList.add('d-none');
  };
}

// ===== Timeline (real dates) =====
function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00Z');
  const d2 = new Date(b + 'T00:00:00Z');
  return Math.max(0, Math.round((d2 - d1) / 86400000));
}
function dateAdd(base, days) {
  const d = new Date(base + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}
function buildDateArray(minDate, maxDate) {
  const n = daysBetween(minDate, maxDate);
  const arr = [];
  for (let i = 0; i <= n; i++) arr.push(dateAdd(minDate, i));
  return arr;
}
function setSliderEnabled(enabled, min=0, max=0, value=0) {
  const slider = document.getElementById('checkpointSlider');
  slider.disabled = !enabled;
  slider.min = String(min);
  slider.max = String(max);
  slider.value = String(value);
}

async function initTimelineForTaxon(taxonId, taxonName) {
  currentTaxonId = Number(taxonId);
  const card = document.getElementById('cpResultsCard');
  if (card) card.style.display = 'block';
  const head = document.getElementById('checkpointSelectedTitle');
  if (head) head.textContent = `${taxonName || ('Taxon ' + taxonId)} — Date Timeline`;

  if (!CURRENT_USER) {
    setSliderEnabled(false);
    document.getElementById('checkpointSummary').textContent = 'Connect your iNaturalist account to build a date timeline.';
    return;
  }

  const params = new URLSearchParams({ user_login: CURRENT_USER, taxon_id: String(currentTaxonId) });
  const r = await fetch(`${API_BASE}/timeline/date-range?${params}`, { headers: { ...getAuthHeaders() } });
  const range = await r.json();

  if (!range.minDate || !range.maxDate) {
    setSliderEnabled(false);
    document.getElementById('checkpointStart').textContent = '';
    document.getElementById('checkpointEnd').textContent = '';
    document.getElementById('checkpointSummary').innerHTML = `<em>No timeline index yet for this taxon.</em> <button id="buildTimelineBtn" class="btn btn-sm btn-primary ms-2">Build Timeline</button>`;
    const btn = document.getElementById('buildTimelineBtn');
    if (btn) btn.onclick = async () => { await buildTimelineIndex(); await initTimelineForTaxon(currentTaxonId, taxonName); };
    return;
  }

  currentDates = buildDateArray(range.minDate, range.maxDate);
  document.getElementById('checkpointStart').textContent = range.minDate;
  document.getElementById('checkpointEnd').textContent = range.maxDate;
  setSliderEnabled(true, 0, currentDates.length - 1, currentDates.length - 1);

  await drawTreeAtDate(currentDates[currentDates.length - 1]);

  const slider = document.getElementById('checkpointSlider');
  slider.oninput = (e) => {
    const idx = Number(e.target.value);
    const date = currentDates[idx];
    if (!date) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { drawTreeAtDate(date); }, 250);
  };
}

async function drawTreeAtDate(isoDate) {
  if (!CURRENT_USER || !currentTaxonId) return;
  const sum = document.getElementById('checkpointSummary');
  if (sum) sum.textContent = `Showing observations on or before ${isoDate}`;
  const cpLoad = document.getElementById('cpLoading');
  if (cpLoad) cpLoad.style.display = 'flex';
  const r = await fetch(`${API_BASE}/timeline/tree-at-date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ username: CURRENT_USER, taxonId: currentTaxonId, date: isoDate })
  });
  const data = await r.json();
  if (!r.ok || !data?.markdown) { console.error('tree-at-date error', data); return; }
  const pre = document.getElementById('cpMarkdownResult');
  if (pre) pre.textContent = data.markdown;
  const tabId = `cp-date-${currentTaxonId}-${isoDate}`;
  ensureCpTab(tabId, `On/before ${isoDate}`);
  renderMarkdownToTab(tabId, data.markdown);
  // cache
  cpCacheSet(cpCacheKeyForDate(currentTaxonId, CURRENT_USER, isoDate), data.markdown);
  if (cpLoad) cpLoad.style.display = 'none';
}

async function buildTimelineIndex() {
  if (!CURRENT_USER || !currentTaxonId) return;
  const btn = document.getElementById('buildTimelineBtn') || document.getElementById('requeryCompareBtn');
  const spinner = document.getElementById('requerySpinner');
  if (btn && spinner) spinner.classList.remove('d-none');
  try {
    const r = await fetch(`${API_BASE}/timeline/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ username: CURRENT_USER, taxonId: currentTaxonId })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'Indexing failed');
  } finally {
    if (btn && spinner) spinner.classList.add('d-none');
  }
}

async function renderCheckpointTree(group, idx) {
  const sel = group.items[idx];
  if (!sel) return;
  const username = localStorage.getItem('inat_username') || '';
  const species = JSON.parse(sel.species_ids_json || '[]');
  // If the slider has a data-date threshold, filter by first-seen timeline
  const slider = document.getElementById('checkpointSlider');
  const threshold = slider && slider.dataset && slider.dataset.thresholdDate ? slider.dataset.thresholdDate : null;
  let filtered = species;
  if (threshold) {
    try {
      const cpLoad = document.getElementById('cpLoading');
      if (cpLoad) cpLoad.style.display = 'flex';
      const tResp = await fetch(firstSeenUrl, { method:'POST', headers: { 'Content-Type':'application/json', ...getAuthHeaders() }, body: JSON.stringify({ username, taxonId: group.taxonId }) });
      const tData = await tResp.json();
      if (tResp.ok && tData && tData.firstSeen) {
        filtered = species.filter(id => {
          const d = tData.firstSeen[id];
          return !d || d <= threshold; // include if no date or first seen before threshold
        });
      }
      if (cpLoad) cpLoad.style.display = 'none';
    } catch (e) { console.warn('timeline first-seen fetch failed', e); }
  }
  // Tab per checkpoint (plus date threshold in title when used)
  const cp = group.items[idx];
  const tabBaseTitle = 'Checkpoint';
  const tabId = `cp-${group.taxonId}-${cp.id}`;
  ensureCpTab(tabId, tabBaseTitle);
  // Cache check first
  const cachedKey = cpCacheKeyForCheckpoint(cp.id, group.taxonId, username, threshold);
  const cached = cpCacheGet(cachedKey);
  if (cached) {
    renderMarkdownToTab(tabId, cached);
    const pre = document.getElementById('cpMarkdownResult');
    if (pre) pre.textContent = cached;
    return;
  }
  const r = await fetch(treeFromSpeciesUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ speciesTaxonIds: filtered, baseTaxonId: group.taxonId })
  });
  const data = await r.json();
  if (!r.ok) return;
  const markdown = data.markdown || '';
  // Render directly in the Checkpoints pane SVG so it's visible on that tab
  try {
    renderMarkdownToTab(tabId, markdown);
    const pre = document.getElementById('cpMarkdownResult');
    if (pre) pre.textContent = markdown;
    cpCacheSet(cachedKey, markdown);
  } catch (e) { console.error('checkpoint markmap render', e); }
}

function renderCheckpointSummary(group, idx) {
  const sel = group.items[idx];
  const div = document.getElementById('checkpointSummary');
  div.innerHTML = `
    <div>
      <div><strong>Date:</strong> ${fmtDate(sel.created_at)}</div>
      <div><strong>Taxon ID:</strong> ${group.taxonId}</div>
    </div>
  `;
}

async function initCheckpointsUI() {
  const btn = document.getElementById('saveCheckpointBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      const payload = window.__lastBuild;
      if (!payload || !payload.taxonId) {
        alert('Build a tree first before saving a checkpoint.');
        return;
      }
      const username = localStorage.getItem('inat_username') || (await fetchCurrentUser())?.login;
      const r = await fetch(saveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          username,
          taxonId:   payload.taxonId,
          taxonName: payload.taxonName,
          speciesTaxonIds: payload.speciesTaxonIds || [],
          rankCounts:      payload.rankCounts || {},
          highWatermarkUpdatedAt: payload.highWatermarkUpdatedAt || null,
        })
      });
      if (!r.ok) {
        const t = await r.text();
        alert('Failed to save checkpoint: ' + t);
        return;
      }
      await loadAndRenderList();
      alert('Checkpoint saved.');
    });
  }
  await loadAndRenderList();
  // Hook up cp clear button
  const cpClearBtn = document.getElementById('cpClearBtn');
  if (cpClearBtn) {
    cpClearBtn.addEventListener('click', async () => {
      const group = window.__cpSelectedGroup;
      const slider = document.getElementById('checkpointSlider');
      const idx = Number(slider?.value || 0);
      const cp = group?.items?.[idx];
      if (!cp) return;
      if (!confirm('Delete this checkpoint?')) return;
      const r = await fetch(deleteUrl, { method:'POST', headers:{ 'Content-Type':'application/json', ...getAuthHeaders() }, body: JSON.stringify({ id: cp.id }) });
      if (r.ok) {
        await loadAndRenderList();
        const card = document.getElementById('cpResultsCard');
        if (card) card.style.display = 'none';
      }
    });
  }
}

async function loadAndRenderList() {
  const username = localStorage.getItem('inat_username') || '';
  const token = localStorage.getItem('inat_token') || '';
  if (!username || !token) return;  // avoid 403 until signed in properly
  const cps = await fetchCheckpoints(username);
  const groups = groupByTaxon(cps);
  renderTaxaList(groups);
}

document.addEventListener('DOMContentLoaded', () => {
  initCheckpointsUI().catch(err => console.error('init checkpoints ui', err));
});


