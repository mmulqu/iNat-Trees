import { getAuthHeaders } from './auth.js';

const API_BASE = window.CF_API_BASE;
const listUrl = `${API_BASE}/checkpoints/list`;
const saveUrl = `${API_BASE}/checkpoints/save`;

function fmtDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

async function fetchCheckpoints(userLogin) {
  const url = new URL(listUrl);
  url.searchParams.set('user_login', userLogin);
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
  const title = document.getElementById('checkpointSelectedTitle');
  title.textContent = `${group.taxonName} — ${group.items.length} checkpoints`;
  const slider = document.getElementById('checkpointSlider');
  slider.disabled = false;
  slider.min = 0;
  slider.max = Math.max(0, group.items.length - 1);
  slider.value = slider.max;
  document.getElementById('checkpointStart').textContent = fmtDate(group.items[0]?.created_at);
  document.getElementById('checkpointEnd').textContent = fmtDate(group.items[group.items.length - 1]?.created_at);
  document.getElementById('requeryCompareBtn').disabled = false;
  renderCheckpointSummary(group, Number(slider.value));
  slider.oninput = () => renderCheckpointSummary(group, Number(slider.value));
  document.getElementById('requeryCompareBtn').onclick = async () => {
    const sel = group.items[Number(slider.value)];
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
  };
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
      if (!payload || !payload.username || !payload.taxonId) {
        alert('Build a tree first before saving a checkpoint.');
        return;
      }
      const r = await fetch(saveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
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
}

async function loadAndRenderList() {
  const username = localStorage.getItem('inat_username') || '';
  if (!username) return;
  const cps = await fetchCheckpoints(username);
  const groups = groupByTaxon(cps);
  renderTaxaList(groups);
}

document.addEventListener('DOMContentLoaded', initCheckpointsUI);


