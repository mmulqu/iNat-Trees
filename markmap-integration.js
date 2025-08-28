// markmap-integration.js
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .user1-node,
    .user1-node a,
    .user1-node .mm-common {
      color: #ff6b6b !important;
      font-weight: bold !important;
    }
    .user2-node,
    .user2-node a,
    .user2-node .mm-common {
      color: #4dabf7 !important;
      font-weight: bold !important;
    }
    .shared-node,
    .shared-node a,
    .shared-node .mm-common {
      color: #cc5de8 !important;
      font-weight: bold !important;
    }
    .battle-summary {
      margin-top: 20px;
      border-radius: 8px;
      overflow: hidden;
    }
    .vs-badge {
      background-color: #f8f9fa;
      color: #495057;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
});

// === Inline chip + preview styles and controller ===
(() => {
  const style = document.createElement('style');
  style.textContent += `
  .mm-badge{display:inline-block; font-size:.72rem; line-height:1; padding:.18rem .36rem; border-radius:.4rem; margin-left:.3rem; background:#eef2f7; color:#334155; vertical-align:middle; border:1px solid rgba(0,0,0,.08)}
  .mm-badge.mm-rank{font-weight:600; letter-spacing:.02em; background:#e2e8f0; color:#111827}
  .mm-badge.mm-count{background:#e6f4ea; color:#1e4620}
  .mm-badge.mm-photo{text-decoration:none; background:#e8f0fe; cursor:pointer; padding:0; width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; border:1px solid transparent}
  .mm-badge.mm-photo::before{content:''; width:12px; height:12px; display:block; background:#334155; -webkit-mask:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000"><path d="M9 3l-1.8 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.2L15 3H9zm3 4a5 5 0 110 10 5 5 0 010-10zm0 2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/></svg>') no-repeat center / contain; mask:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000"><path d="M9 3l-1.8 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.2L15 3H9zm3 4a5 5 0 110 10 5 5 0 010-10zm0 2.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/></svg>') no-repeat center / contain}
  /* Dark theme overrides for badges */
  body.dark-theme .mm-badge{background:#2a2d2f; color:#e6e6e6 !important; border-color:#3a3f42}
  body.dark-theme .mm-badge.mm-rank{background:#334155; color:#f8fafc !important}
  body.dark-theme .mm-badge.mm-count{background:#123524; color:#a7f3d0}
  body.dark-theme .mm-badge.mm-photo::before{background:#e5e7eb}
  .mm-common{opacity:.7}
  .first-obs-preview{position:absolute; z-index:9999; width:300px; max-width:44vw; box-shadow:0 8px 24px rgba(0,0,0,.18); border:1px solid rgba(0,0,0,.08); border-radius:10px; overflow:hidden; background:#fff}
  .first-obs-preview header{display:flex; justify-content:space-between; align-items:center; padding:.5rem .7rem; font-size:.9rem; background:#f8fafc; border-bottom:1px solid #eee; color:#111827}
  .first-obs-preview .body{padding:.5rem .7rem}
  .first-obs-preview img{width:100%; height:auto; display:block}
  .first-obs-preview .actions{display:flex; gap:.5rem; margin-top:.5rem}
  .first-obs-spinner{width:100%; padding:1rem; text-align:center; font-size:.9rem; color:#6b7280}
  /* Dark theme overrides for preview */
  body.dark-theme .first-obs-preview{background:#1d1f20; border-color:#3a3f42}
  body.dark-theme .first-obs-preview header{background:#202324; color:#e6e6e6}
  body.dark-theme .first-obs-preview .text-muted{color:#cfd6d8 !important}
  `;
  document.head.appendChild(style);
})();

(() => {
  const API_BASE = window.CF_API_BASE;
  if (!API_BASE) return;
  const cache = new Map();
  let previewEl = null;
  function authHeaders(){
    const headers = { 'Accept': 'application/json' };
    const jwt = localStorage.getItem('inat_jwt');
    const token = localStorage.getItem('inat_token');
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`; else if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }
  function closestPane(el){ return el.closest('.tab-pane'); }
  function key(u,t){ return `${u}:${t}`; }
  async function fetchFirstObs(username, taxonId){
    const k = key(username, taxonId);
    // localStorage cache (persist across reloads)
    try {
      const raw = localStorage.getItem('firstObsCache');
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj[k]) return obj[k];
      }
    } catch(_) {}
    if (cache.has(k)) return cache.get(k);
    const u = new URL(`${API_BASE}/first-observation`);
    u.searchParams.set('username', username);
    u.searchParams.set('taxon_id', String(taxonId));
    const r = await fetch(u.toString(), { headers: authHeaders() });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cache.set(k, data);
    try {
      const raw = localStorage.getItem('firstObsCache');
      const obj = raw ? JSON.parse(raw) : {};
      obj[k] = data;
      // cap size to ~100 entries
      const keys = Object.keys(obj);
      if (keys.length > 100) delete obj[keys[0]];
      localStorage.setItem('firstObsCache', JSON.stringify(obj));
    } catch(_) {}
    return data;
  }
  function ensurePreview(){
    if (previewEl) return previewEl;
    previewEl = document.createElement('div');
    previewEl.className='first-obs-preview';
    previewEl.style.display='none';
    document.body.appendChild(previewEl);
    // Close on ESC
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') previewEl.style.display='none';});
    // Outside click close (bubble phase) and ignore clicks on chips
    document.addEventListener('click', e=>{
      if (e.target && e.target.closest && e.target.closest('a.first-obs-trigger')) return;
      if (previewEl && previewEl.style.display!=='none' && !previewEl.contains(e.target)) previewEl.style.display='none';
    });
    return previewEl;
  }
  function position(rect){ const el=ensurePreview(); const m=8; const top=window.scrollY+rect.bottom+m; const left=Math.min(window.scrollX+rect.left, window.scrollX+document.documentElement.clientWidth-el.offsetWidth-m); el.style.top=`${top}px`; el.style.left=`${left}px`; }
  function spinner(rect){ const el=ensurePreview(); el.innerHTML='<div class="first-obs-spinner">Loading…</div>'; el.style.display='block'; position(rect); }
  function render(rect, username, taxonId, payload){ const el=ensurePreview(); if(!payload||payload.notFound){ el.innerHTML='<header><strong>No photo found</strong><button class="btn btn-sm btn-link" onclick="this.closest(\'.first-obs-preview\').style.display=\'none\'">✕</button></header><div class="body"><div class="text-muted">Try relaxing filters on iNat</div></div>'; el.style.display='block'; position(rect); return; } const {obs_url, observed_on, image_urls}=payload; const img=image_urls?.medium||image_urls?.small||image_urls?.thumb||''; const full=image_urls?.original||img||obs_url; el.innerHTML=`<header><div>First photo • <span class="text-muted">${observed_on?new Date(observed_on).toLocaleDateString():'date unknown'}</span></div><button class="btn btn-sm btn-link" onclick="this.closest('.first-obs-preview').style.display='none'">✕</button></header><div class="body">${img?`<img alt="First observation photo" src="${img}">`:''}<div class="actions"><a class="btn btn-sm btn-primary" href="${obs_url}" target="_blank" rel="noopener">Open observation</a>${full?`<a class="btn btn-sm btn-outline-secondary" href="${full}" target="_blank" rel="noopener">Open image</a>`:''}</div></div>`; el.style.display='block'; position(rect); }
  let t=null; document.addEventListener('mouseenter', e=>{ const a=e.target.closest('a.first-obs-trigger'); if(!a) return; const pane=closestPane(a); const username=a.dataset.username||pane?.dataset.username; const taxonId=a.dataset.taxonId||a.getAttribute('data-taxon-id'); if(!username||!taxonId) return; t=setTimeout(async ()=>{ try{ const payload=await fetchFirstObs(username, taxonId); if(!payload||payload.notFound||!payload.image_urls){ a.remove(); } }catch(_){} },250); }, true); document.addEventListener('mouseleave', e=>{ if(t){clearTimeout(t); t=null;} }, true);
  document.addEventListener('click', async e=>{ const a=e.target.closest('a.first-obs-trigger'); if(!a) return; e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); const pane=closestPane(a); const username=a.dataset.username||pane?.dataset.username||a.dataset.username1||a.dataset.username2; const taxonId=a.dataset.taxonId||a.getAttribute('data-taxon-id'); if(!username||!taxonId) return; const rect=a.getBoundingClientRect(); spinner(rect); try{ const payload=await fetchFirstObs(username, taxonId); if(e.metaKey||e.ctrlKey){ if(payload&&payload.obs_url) window.open(payload.obs_url,'_blank'); ensurePreview().style.display='none'; return;} if(!payload||payload.notFound||!payload.image_urls){ a.remove(); ensurePreview().style.display='none'; return;} render(rect, username, taxonId, payload);}catch(err){ ensurePreview().style.display='none'; console.error('first-observation error', err);} }, true);
})();
