// checklist.js
// Minimal UI glue for the Region Checklist tab

(async function initChecklistUI(){
  const form = document.getElementById('checklistForm');
  if (!form) return;

  const clUsername = document.getElementById('clUsername');
  const clRegion   = document.getElementById('clRegion');
  const clTaxName  = document.getElementById('clTaxonName');
  const clTaxId    = document.getElementById('clSelectedTaxonId');
  const clAuto     = document.getElementById('clAutocomplete');
  const clUseIdBtn = document.getElementById('clUseIdBtn');
  const spinner    = document.getElementById('clSpinner');

  // --- helpers ---
  function authHeader() {
    try {
      const t = localStorage.getItem('inat_token');
      return t ? { Authorization: `Bearer ${t}` } : {};
    } catch { return {}; }
  }
  function showSpinner(on) { spinner.style.display = on ? 'flex' : 'none'; }
  function searchTaxaUrl(q) {
    const u = new URL('/search-taxa', location.origin);
    u.searchParams.set('q', q);
    u.searchParams.set('limit', '15');
    return u.toString();
  }

  // --- populate regions ---
  try {
    const r = await fetch('/regions', { headers: { 'Accept': 'application/json' } });
    const j = await r.json();
    clRegion.innerHTML = '<option value="">Select a region…</option>';
    (j.regions || []).forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg.code;
      opt.textContent = `${reg.name} (${reg.code})`;
      clRegion.appendChild(opt);
    });
  } catch (e) {
    clRegion.innerHTML = '<option value="">(failed to load regions)</option>';
  }

  // --- tiny autocomplete for base taxon ---
  let tHandle = null;
  clTaxName.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    clTaxId.value = '';
    if (tHandle) clearTimeout(tHandle);
    if (q.length < 2) { clAuto.style.display='none'; return; }
    tHandle = setTimeout(async () => {
      const r = await fetch(searchTaxaUrl(q));
      const j = await r.json();
      clAuto.innerHTML = '';
      (j.results || []).forEach(t => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = `${t.common_name ? t.common_name + ' ('+t.name+')' : t.name} [${t.rank}]`;
        div.addEventListener('click', () => {
          clTaxName.value = t.common_name ? `${t.common_name} (${t.name})` : t.name;
          clTaxId.value = t.taxon_id || t.id;
          clAuto.style.display = 'none';
        });
        clAuto.appendChild(div);
      });
      clAuto.style.display = (clAuto.children.length ? 'block' : 'none');
    }, 250);
  });

  // Let the user paste an ID manually
  clUseIdBtn.addEventListener('click', () => {
    const m = clTaxName.value.match(/\b(\d{1,9})\b/);
    if (m) { clTaxId.value = m[1]; alert(`Using taxon ID ${m[1]}`); }
    else { alert('Type or select a taxon, or include its numeric ID in the box.'); }
  });

  // --- submit: call /checklist/tree ---
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const username = clUsername.value.trim();
    const region   = clRegion.value;
    const baseId   = clTaxId.value.trim();

    if (!username || !region || !baseId) {
      alert('Please provide username, region, and a base taxon.');
      return;
    }

    showSpinner(true);
    try {
      const r = await fetch('/checklist/tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ username, region_code: region, baseTaxonId: parseInt(baseId, 10) })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || r.statusText);

      // Create a standard tree tab using your existing treeManager
      const taxonLabel = clTaxName.value || `Taxon ${baseId}`;
      const title = `Targets: ${region} — ${taxonLabel}`;
      if (window.treeManager && typeof window.treeManager.addTree === 'function') {
        window.treeManager.addTree(username, title, baseId, j.markdown);
      } else {
        console.warn('treeManager.addTree missing; falling back to alert');
        alert('Tree built. Open the Markdown accordion to view.');
        document.getElementById('generatedMarkdown').textContent = j.markdown || '(empty)';
      }
    } catch (e) {
      console.error(e);
      alert(`Checklist build failed: ${e.message}`);
    } finally {
      showSpinner(false);
    }
  });
})();
