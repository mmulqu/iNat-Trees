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

async function loadRegions(){
  const r = await fetch(`${API}/regions`, { headers: authHeaders() });
  const j = await r.json();
  return j.regions || [];
}

function setSpinner(on){ document.getElementById('clSpinner').style.display = on ? 'flex' : 'none'; }

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
      if (r.inat_place_id != null) opt.dataset.placeId = String(r.inat_place_id);
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
    // This now correctly and exclusively uses the manager
    if (window.checklistManager) {
      window.checklistManager.clearAllTrees();
    }
  });

  // submit
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const username = document.getElementById('clUsername').value.trim();
    const region   = clRegion.value;
    const baseId   = (clTaxId.value || '').trim();
    const scope = (window.getLifelistScope ? window.getLifelistScope() : 'global');

    if (!username || !region || !baseId) {
      alert('Please provide username, region, and a base taxon ID.');
      return;
    }

    setSpinner(true);
    try {
      const payload = {
        username,
        region_code: region,
        baseTaxonId: parseInt(baseId, 10),
        scope
      };
      
      const r = await fetch(`${API}/checklist/tree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
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
      
      // Use new addChecklistTreeTab function with map support
      addChecklistTreeTab(title, j.markdown);
    } catch (e) {
      console.error(e);
      alert(`Checklist build failed: ${e.message}`);
    } finally {
      setSpinner(false);
    }
  });
}

// Map helpers and badge wiring
const COLORS = ['#ef4444','#3b82f6','#22c55e','#a855f7','#eab308','#14b8a6','#f97316','#ec4899'];

function nextColor(state){
  const c = COLORS[state.colorIdx % COLORS.length];
  state.colorIdx++;
  return c;
}

function wireRangeButtons(pane){
  // delegate in the pane: any click on .range-trigger adds layers
  pane.addEventListener('click', (e) => {
    const a = e.target.closest('.range-trigger');
    if (!a) return;
    e.preventDefault();
    const taxonId = a.dataset.taxonId;
    const name = a.dataset.taxonName || a.textContent || `taxon ${taxonId}`;
    addSpeciesToMap(pane, taxonId, name);
  });
}

async function addSpeciesToMap(pane, taxonId, name){
  const state = pane._mapState;
  if (!state || state.addedIds.has(taxonId)) return;

  const color = nextColor(state);
  const placeId = pane.dataset.placeId || '';  // empty => skip region filter on obs

  // 1) Range polygon (from Open Range Maps S3)
  const rangeUrl = `https://inaturalist-open-data.s3.us-east-1.amazonaws.com/geomodel/geojsons/latest/${taxonId}.geojson`;
  let rangeLayer = null;
  try {
    const gj = await fetch(rangeUrl).then(r => {
      if (!r.ok) throw new Error('No range available'); return r.json();
    });
    rangeLayer = L.geoJSON(gj, {
      style: { color, weight: 2, fillOpacity: 0.25 }
    }).addTo(state.rangeGroup);
    rangeLayer.bindPopup(`<b>${name}</b><br/>Range (iNat Open Range Maps)`);
  } catch { /* no range available, ignore */ }

  // 2) Observations (scoped to region if we have a placeId)
  let obsLayer = null;
  try {
    const u = new URL('https://api.inaturalist.org/v1/observations');
    u.searchParams.set('taxon_id', taxonId);
    if (placeId) u.searchParams.set('place_id', placeId);
    u.searchParams.set('per_page','200');
    u.searchParams.set('geo','true');
    u.searchParams.set('quality_grade','research');
    u.searchParams.set('order_by','observed_on');
    u.searchParams.set('order','desc');

    const headers = authHeaders();
    const j = await fetch(u, { headers }).then(r => r.json());
    const pts = (j.results||[])
      .map(r => {
        // prefer r.location string "lat,lon"
        if (r.location) {
          const [lat, lon] = String(r.location).split(',').map(Number);
          return { lat, lon, r };
        } else if (r.geojson?.coordinates?.length === 2) {
          const [lon, lat] = r.geojson.coordinates.map(Number);
          return { lat, lon, r };
        }
        return null;
      })
      .filter(Boolean);

    if (pts.length) {
      obsLayer = L.layerGroup(
        pts.map(p => L.circleMarker([p.lat, p.lon], {
          radius: 5, color, fillColor: color, fillOpacity: 0.8, weight: 1
        }).bindPopup(renderObsPopup(p.r)))
      ).addTo(state.obsGroup);
    }
  } catch { /* quietly ignore */ }

  state.addedIds.add(taxonId);

  // Fit map to whatever we added first
  const bounds = L.latLngBounds([]);
  if (rangeLayer) bounds.extend(rangeLayer.getBounds());
  if (state.obsGroup.getLayers().length) {
    state.obsGroup.getLayers().forEach(l => {
      if (l.getBounds) bounds.extend(l.getBounds());
      else if (l.getLatLng) bounds.extend([l.getLatLng()]);
    });
  }
  if (bounds.isValid()) state.map.fitBounds(bounds.pad(0.05));
}

function renderObsPopup(r){
  const sci = r?.taxon?.name || '';
  const com = r?.taxon?.preferred_common_name || '';
  const when = r?.observed_on || r?.time_observed_at || '';
  const who = r?.user?.login || '';
  const photo = (r?.photos?.[0]?.url || '').replace('square','medium');
  const img = photo ? `<img src="${photo}" style="max-width:220px;width:100%;border-radius:6px;margin-top:6px">` : '';
  return `<b>${com || sci}</b>${com && sci ? ` <i>(${sci})</i>` : ''}<br/>
          Observed: ${when}<br/>Observer: ${who}${img}`;
}

function addNMore(pane, n){
  const anchors = [...pane.querySelectorAll('.range-trigger')];
  let added = 0;
  for (const a of anchors) {
    const id = a.dataset.taxonId;
    if (!pane._mapState.addedIds.has(id)) {
      addSpeciesToMap(pane, id, a.dataset.taxonName || '');
      if (++added >= n) break;
    }
  }
}

function clearAllLayers(pane){
  const s = pane._mapState;
  if (!s) return;
  s.rangeGroup.clearLayers();
  s.obsGroup.clearLayers();
  s.addedIds.clear();
  s.colorIdx = 0;
}

function addChecklistTreeTab(title, markdown){
  showResultsCard();
  const id = uid();

  // read selected region + place_id at creation time
  const clRegion = document.getElementById('clRegion');
  const regionCode = clRegion.value;
  const placeId = clRegion.selectedOptions[0]?.dataset?.placeId || '';

  // header
  const tabs = document.getElementById('clTreeTabs');
  const li = document.createElement('li'); li.className = 'nav-item';
  li.innerHTML = `<a class="nav-link" id="${id}-tab" data-bs-toggle="tab" href="#${id}-content" role="tab" aria-controls="${id}-content" aria-selected="false">${title}</a>`;
  tabs.appendChild(li);

  // content: map toolbar + map + markmap svg
  const content = document.getElementById('clTreeTabContent');
  const pane = document.createElement('div');
  pane.className = 'tab-pane';
  pane.id = `${id}-content`;
  pane.setAttribute('role','tabpanel');
  pane.dataset.regionCode = regionCode;
  pane.dataset.placeId = placeId;
  pane.innerHTML = `
    <div class="mb-2 d-flex gap-2">
      <button class="btn btn-sm btn-outline-primary" id="${id}-addMoreBtn" title="Add 4 more ranges">+4 More</button>
      <button class="btn btn-sm btn-outline-secondary" id="${id}-clearMapBtn" title="Remove all layers">Clear Map</button>
    </div>
    <div id="${id}-map" style="height:420px;border-radius:10px;overflow:hidden;margin-bottom:12px;"></div>
    <div class="markmap-container">
      <svg id="${id}-svg" width="100%" height="700"></svg>
    </div>
  `;
  content.appendChild(pane);

  // show markdown in side accordion
  document.getElementById('clMarkdownResult').textContent = markdown;

  // activate, then render both map and markmap
  activateTab(id);
  setTimeout(() => {
    // 1) Leaflet init
    const map = L.map(`${id}-map`, { zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    map.setView([20,0], 2); // world view; we'll fit on first layer
    // keep state per pane
    pane._mapState = {
      map,
      rangeGroup: L.layerGroup().addTo(map),
      obsGroup: L.layerGroup().addTo(map),
      addedIds: new Set(),
      colorIdx: 0
    };

    // 2) Markmap
    const svg = document.getElementById(`${id}-svg`);
    svg.innerHTML = '';
    mmRender(svg, markdown);

    // 3) Wire 🗺️ clicks and auto-add up to 4 to avoid overload
    wireRangeButtons(pane);
    addNMore(pane, 4);
    // toolbar
    document.getElementById(`${id}-addMoreBtn`).onclick = () => addNMore(pane, 4);
    document.getElementById(`${id}-clearMapBtn`).onclick = () => clearAllLayers(pane);
  }, 60);
}

// Helper functions
function showResultsCard() {
  const card = document.getElementById('clResultsCard');
  if (card) card.style.display = 'block';
}

function uid() {
  return 'cl_' + Math.random().toString(36).substr(2, 9);
}

function activateTab(id) {
  // Remove active from all tabs
  document.querySelectorAll('#clTreeTabs .nav-link').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  
  // Add active to new tab
  const newTab = document.getElementById(`${id}-tab`);
  if (newTab) {
    newTab.classList.add('active');
    newTab.setAttribute('aria-selected', 'true');
  }
  
  // Remove active from all panes
  document.querySelectorAll('#clTreeTabContent .tab-pane').forEach(pane => {
    pane.classList.remove('show', 'active');
  });
  
  // Add active to new pane
  const newPane = document.getElementById(`${id}-content`);
  if (newPane) {
    newPane.classList.add('show', 'active');
  }
}

function mmRender(svg, markdown) {
  if (window.checklistManager && window.checklistManager.renderTree) {
    // Create a temporary tree object for rendering
    const tempTree = {
      id: svg.id.replace('-svg', ''),
      markdown: markdown,
      isChecklist: true
    };
    window.checklistManager.renderTree(tempTree);
  }
}

document.addEventListener('DOMContentLoaded', initChecklistUI);