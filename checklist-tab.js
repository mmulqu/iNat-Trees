// checklist-tab.js
const API = (window.CF_API_BASE || '').replace(/\/+$/, '');

function authHeaders(){
  const headers = { 'Accept': 'application/json' };
  try {
    const jwt = localStorage.getItem('inat_jwt');
    const token = localStorage.getItem('inat_token');
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
    else if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {}
  return headers;
}

function mmRender(svg, markdown){
  const md = (window.mmPreprocessColors ? window.mmPreprocessColors(markdown) : String(markdown||''));
  const { Transformer, Markmap } = window.markmap;
  const transformer = new Transformer();
  const { root } = transformer.transform(md);
  const mm = Markmap.create(svg, {
    htmlLabels: true,
    color: (node) => {
      const s = (node.v || node.content || node.payload?.content || '');
      if (typeof s === 'string') {
        if (s.includes('seen-node'))   return '#22c55e';
        if (s.includes('unseen-node')) return '#9ca3af';
      }
      return undefined;
    }
  }, root);
  // fit + color edges after layout
  setTimeout(() => {
    try { mm.fit(); } catch {}
    try { window.mmColorEdgesFromLabels && window.mmColorEdgesFromLabels(svg); } catch {}
  }, 60);
  return mm;
}

function uid(){ return 'cl' + Math.random().toString(36).slice(2,9); }

async function loadRegions(){
  const r = await fetch(`${API}/regions`, { headers: authHeaders() });
  const j = await r.json();
  return j.regions || [];
}

function setSpinner(on){ document.getElementById('clSpinner').style.display = on ? 'flex' : 'none'; }
function showResultsCard(){ document.getElementById('clResultsCard').style.display = 'block'; }

function activateTab(tabId){
  // Bootstrap tab show
  const tab = document.getElementById(`${tabId}-tab`);
  if (tab && window.bootstrap?.Tab) new bootstrap.Tab(tab).show();
}

function addChecklistTreeTab(title, markdown){
  showResultsCard();
  const id = uid();

  // header
  const tabs = document.getElementById('clTreeTabs');
  const li = document.createElement('li'); li.className = 'nav-item';
  li.innerHTML = `
    <a class="nav-link" id="${id}-tab" data-bs-toggle="tab" href="#${id}-content" role="tab" aria-controls="${id}-content" aria-selected="false">${title}</a>
  `;
  tabs.appendChild(li);

  // content
  const content = document.getElementById('clTreeTabContent');
  const pane = document.createElement('div');
  pane.className = 'tab-pane';
  pane.id = `${id}-content`;
  pane.setAttribute('role','tabpanel');
  pane.innerHTML = `
    <div class="markmap-container">
      <svg id="${id}-svg" width="100%" height="700"></svg>
    </div>
  `;
  content.appendChild(pane);

  // markdown panel
  const mdOut = document.getElementById('clMarkdownResult');
  mdOut.textContent = markdown;

  // activate and render
  activateTab(id);
  setTimeout(() => {
    const svg = document.getElementById(`${id}-svg`);
    svg.innerHTML = '';
    mmRender(svg, markdown);
  }, 60);
}

async function hydrateRegion(regionCode){
  const r = await fetch(`${API}/checklist/hydrate`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...authHeaders() },
    body: JSON.stringify({ region_code: regionCode })
  });
  const j = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(j?.error || r.statusText);
  return j;
}

async function initChecklistUI(){
  const form = document.getElementById('checklistForm');
  if (!form) return;

  const clRegion = document.getElementById('clRegion');
  const clTaxName = document.getElementById('clTaxonName');
  const clTaxId   = document.getElementById('clSelectedTaxonId');
  const clAuto    = document.getElementById('clAutocomplete');

  // regions
  try {
    const regions = await loadRegions();
    clRegion.innerHTML = '<option value="">Select a region…</option>';
    regions.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.code;
      opt.textContent = `${r.name} (${r.code})`;
      clRegion.appendChild(opt);
    });
  } catch { clRegion.innerHTML = '<option value="">(failed to load regions)</option>'; }

  // autocomplete (reuse your /search-taxa)
  let tHandle = null;
  clTaxName.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    clTaxId.value = '';
    if (tHandle) clearTimeout(tHandle);
    if (q.length < 2) { clAuto.style.display='none'; return; }
    tHandle = setTimeout(async () => {
      const u = new URL(`${API}/search-taxa`);
      u.searchParams.set('q', q); u.searchParams.set('limit','15');
      const r = await fetch(u, { headers: authHeaders() });
      const j = await r.json();
      clAuto.innerHTML = '';
      (j.results || []).forEach(t => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerHTML = `${t.common_name ? `<strong>${t.common_name}</strong> <span class="scientific-name">(${t.name})</span>` : `<span class="scientific-name">${t.name}</span>`} <span class="taxon-id">#${t.taxon_id||t.id}</span>`;
        div.addEventListener('click', () => {
          clTaxName.value = t.common_name ? `${t.common_name} (${t.name})` : t.name;
          clTaxId.value = t.taxon_id || t.id;
          clAuto.style.display = 'none';
        });
        clAuto.appendChild(div);
      });
      clAuto.style.display = clAuto.children.length ? 'block' : 'none';
    }, 200);
  });

  document.getElementById('clUseIdBtn').addEventListener('click', () => {
    const m = clTaxName.value.match(/\b(\d{1,9})\b/);
    if (m) { clTaxId.value = m[1]; alert(`Using taxon ID ${m[1]}`); }
    else { alert('Type/select a taxon or include a numeric ID in the box.'); }
  });

  // hydrate button
  document.getElementById('clHydrateBtn').addEventListener('click', async () => {
    const region = clRegion.value;
    const baseId = (document.getElementById('clSelectedTaxonId').value || '').trim();
    if (!region) return alert('Select a region first');

    setSpinner(true);
    try {
      const payload = baseId ? { region_code: region, baseTaxonId: parseInt(baseId,10) }
                             : { region_code: region };
      const r = await fetch(`${API}/checklist/hydrate`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || r.statusText);
      alert(`Hydrated ${j.hydrated_species_rows + j.hydrated_ancestor_rows} taxa for ${region}${baseId?` (base ${baseId})`:''}`);
    } catch (e) { 
      alert(`Hydrate failed: ${e.message}`); 
    } finally { 
      setSpinner(false); 
    }
  });

  // clear all
  document.getElementById('clClearBtn').addEventListener('click', () => {
    document.getElementById('clTreeTabs').innerHTML = '';
    document.getElementById('clTreeTabContent').innerHTML = '';
    document.getElementById('clMarkdownResult').textContent = '';
    document.getElementById('clResultsCard').style.display = 'none';
  });

  // submit
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const username = document.getElementById('clUsername').value.trim();
    const region   = clRegion.value;
    const baseId   = (clTaxId.value || '').trim();

    if (!username || !region || !baseId) {
      alert('Please provide username, region, and a base taxon ID.');
      return;
    }

    setSpinner(true);
    try {
      const r = await fetch(`${API}/checklist/tree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ username, region_code: region, baseTaxonId: parseInt(baseId, 10) })
      });
      const j = await r.json().catch(()=>({}));
      if (!r.ok) {
        if (r.status === 409 && /hydrate/i.test(j?.error||'')) {
          if (confirm('Region taxa not hydrated. Hydrate now?')) {
            await hydrateRegion(region);
            return form.dispatchEvent(new Event('submit')); // try again
          }
        }
        throw new Error(j?.error || r.statusText);
      }

      const taxonLabel = document.getElementById('clTaxonName').value || `Taxon ${baseId}`;
      const title = `Targets: ${region} — ${taxonLabel}`;
      addChecklistTreeTab(title, j.markdown);
    } catch (e) {
      console.error(e);
      alert(`Checklist build failed: ${e.message}`);
    } finally {
      setSpinner(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', initChecklistUI);
