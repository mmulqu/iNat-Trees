// tree-manager.js

// ---- Markmap mini-map + scroll gutters (global styles) ----
(() => {
  if (document.getElementById('mm-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'mm-ux-styles';
  s.textContent = `
    .markmap-container { position: relative; }

    /* Mini-map box */
    .mm-minimap {
      position: absolute; right: 12px; bottom: 12px;
      width: 180px; height: 120px;
      border-radius: 10px;
      background: rgba(255,255,255,.82);
      border: 1px solid rgba(0,0,0,.15);
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      z-index: 5;
      pointer-events: none; /* visual-only */
    }
    body.dark-theme .mm-minimap {
      background: rgba(0,0,0,.52);
      border-color: rgba(255,255,255,.22);
    }
    .mm-minimap.hidden { display: none; }

    /* Mini-map link + connector strokes */
    .mm-minimap .mm-mini-links path,
    .mm-minimap .mm-mini-links line,
    .mm-minimap .mm-mini-conns line {
      vector-effect: non-scaling-stroke;
      stroke-width: .9;
      stroke: #6b7280;
      stroke-opacity: .65;
      fill: none;
    }
    body.dark-theme .mm-minimap .mm-mini-links path,
    body.dark-theme .mm-minimap .mm-mini-links line,
    body.dark-theme .mm-minimap .mm-mini-conns line {
      stroke: #a8b1b8;
      stroke-opacity: .75;
    }

    /* Color the mini-map edges to match PVP */
    .mm-minimap .user1-edge { stroke: #dc2626 !important; stroke-opacity: .95; }
    .mm-minimap .user2-edge { stroke: #2563eb !important; stroke-opacity: .95; }
    .mm-minimap .shared-edge { stroke: #9333ea !important; stroke-opacity: .95; }

    /* Hide labels in the mini-map */
    .mm-minimap text, .mm-minimap foreignObject { display: none !important; }

    /* Live viewport box */
    .mm-minimap .mm-mini-viewport {
      fill: none;
      stroke: #111827;
      stroke-width: 2;
      stroke-opacity: .9;
      rx: 3; ry: 3;
    }
    body.dark-theme .mm-minimap .mm-mini-viewport { stroke: #e5e7eb; }

    /* Scroll gutters */
    :root { --mm-scroll-gutter: 36px; }
    @media (min-width: 992px) { :root { --mm-scroll-gutter: 48px; } }
    .mm-scroll-gutter {
      position: absolute; top: 0; bottom: 0; width: var(--mm-scroll-gutter);
      background: transparent; z-index: 8; pointer-events: auto;
    }
    .mm-scroll-gutter.left  { left: 0; }
    .mm-scroll-gutter.right { right: 0; }
    .mm-scroll-gutter.left:hover  { background: linear-gradient(to right, rgba(0,0,0,.06), transparent); }
    .mm-scroll-gutter.right:hover { background: linear-gradient(to left,  rgba(0,0,0,.06), transparent); }
    body.dark-theme .mm-scroll-gutter.left:hover  { background: linear-gradient(to right, rgba(255,255,255,.06), transparent); }
    body.dark-theme .mm-scroll-gutter.right:hover { background: linear-gradient(to left,  rgba(255,255,255,.06), transparent); }
  `;
  document.head.appendChild(s);
})();


class TreeManager {
  constructor() {
    this.trees = [];
    this.currentId = 0;
    this.tabsContainer = document.getElementById('treeTabs');
    this.tabContentContainer = document.getElementById('treeTabContent');
    document.getElementById('deleteAllTrees').addEventListener('click', () => this.clearAllTrees());
  }

  generateTreeId() {
    return `tree-${++this.currentId}`;
  }

  addTree(username, taxonName, taxonId, markdown) {
    const treeId = this.generateTreeId();

    // Process markdown to extract statistics if not already provided
    let stats = null;
    try {
      if (window.taxonomyStats && typeof window.taxonomyStats.processMarkdown === 'function') {
        stats = window.taxonomyStats.processMarkdown(markdown);
      }
    } catch (error) {
      console.error('Error in TreeManager.addTree calculating statistics:', error);
    }

    const tree = {
      id: treeId,
      username,
      taxonName,
      taxonId,
      markdown,
      stats, // Store the calculated statistics (might be null)
      timestamp: new Date()
    };
    this.trees.push(tree);
    this.createTreeTab(tree);
    // Render immediately (and later on tab shown we re-render)
    this.renderTree(tree);
    return treeId;
  }

  reRenderActiveTab() {
    // Try to find the active tree tab
    let activeTabLink = this.tabsContainer.querySelector('.nav-link.active');
    // If none is found and trees exist, use the most recent tab
    if (!activeTabLink && this.trees.length > 0) {
      activeTabLink = document.getElementById(this.trees[this.trees.length - 1].id + '-tab');
    }
    if (!activeTabLink) {
      console.log("No active tree tab found.");
      return;
    }
    const treeId = activeTabLink.id.replace('-tab', '');
    const tree = this.trees.find(t => t.id === treeId);
    if (!tree) return;
    console.log("Re-rendering tree", treeId, "isComparison:", tree.isComparison);
    if (tree.isComparison) {
      this.renderComparisonTree(tree);
    } else {
      this.renderTree(tree);
    }
  }

  // Add this method to the TreeManager class
  reactivateVisibleTrees() {
    // This method will be called when the main tabs are switched
    // Find all visible tree tabs and re-render them
    const visibleTabs = document.querySelectorAll('.tab-pane.show.active .tab-pane.active');
    visibleTabs.forEach(tab => {
      const treeId = tab.id.replace('-content', '');
      const tree = this.trees.find(t => t.id === treeId);
      if (tree) {
        setTimeout(() => {
          if (tree.isComparison) {
            this.renderComparisonTree(tree);
          } else {
            this.renderTree(tree);
          }
        }, 100); // Small delay to ensure DOM is ready
      }
    });
  }

  createTreeTab(tree) {
    const tabHeader = document.createElement('li');
    tabHeader.className = 'nav-item';
    tabHeader.innerHTML = `
      <a class="nav-link" id="${tree.id}-tab" data-bs-toggle="tab" href="#${tree.id}-content" role="tab" 
         aria-controls="${tree.id}-content" aria-selected="false">
        <span class="tab-title">${this.formatTabTitle(tree)}</span>
        <button class="btn-close ms-2 btn-close-white text-sm" aria-label="Close" 
                style="font-size: 0.5rem; opacity: 0.5;" data-tree-id="${tree.id}"></button>
      </a>
    `;
    const tabContent = document.createElement('div');
    if (this.trees.length === 1) {
      tabContent.className = 'tab-pane fade show active';
      tabHeader.querySelector('a').setAttribute('aria-selected', 'true');
    } else {
      tabContent.className = 'tab-pane fade';
    }
    tabContent.id = `${tree.id}-content`;
    // expose username for downstream controllers
    tabContent.dataset.username = tree.username;
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', `${tree.id}-tab`);
    const svgContainer = document.createElement('div');
    svgContainer.className = 'markmap-container';
    svgContainer.innerHTML = `<svg id="${tree.id}-svg" style="width: 100%; height: 700px;"></svg>`;
    tabContent.appendChild(svgContainer);
    const treeInfo = document.createElement('div');
    treeInfo.className = 'tree-info mt-3 p-2 bg-light rounded';
    treeInfo.innerHTML = `
      <small class="text-muted">
        Username: <strong>${tree.username}</strong> | 
        Taxon: <strong>${tree.taxonName || tree.taxonId}</strong> | 
        Generated: <strong>${tree.timestamp.toLocaleTimeString()}</strong>
      </small>
    `;
    tabContent.appendChild(treeInfo);
    this.tabsContainer.appendChild(tabHeader);
    this.tabContentContainer.appendChild(tabContent);
    const closeBtn = tabHeader.querySelector('.btn-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeTree(tree.id);
    });
    const tabTrigger = tabHeader.querySelector('a');
    tabTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      new bootstrap.Tab(tabTrigger).show();
    });
    // When the tab is shown, clear the SVG and re-render the tree
    tabTrigger.addEventListener('shown.bs.tab', () => {
      // Clear any existing renderers first to prevent memory leaks
      const svg = document.getElementById(`${tree.id}-svg`);
      if (svg) svg.innerHTML = '';

      setTimeout(() => {
        this.renderTree(tree);
      }, 100);
    });
    if (this.trees.length === 1) {
      new bootstrap.Tab(tabTrigger).show();
    }
  }

  formatTabTitle(tree) {
    let title = tree.taxonName || `Taxon ${tree.taxonId}`;
    if (title.length > 20) {
      title = title.substring(0, 18) + '...';
    }
    return title;
  }

  renderTree(tree) {
    const svg = document.getElementById(`${tree.id}-svg`);
    if (!svg) return;
  
    // Clear the SVG container before rendering
    svg.innerHTML = '';
  
    const { Transformer, Markmap } = window.markmap;
    const transformer = new Transformer();
    const { root } = transformer.transform(tree.markdown);
  
    const mm = Markmap.create(svg, {
      htmlLabels: true,
      duration: 500,
      autoFit: true,
      fitRatio: 0.98,
      initialExpandLevel: -1,   // show full tree immediately
      pan: true,
      zoom: true,
      scrollForPan: true
    }, root);
  
    // Keep a handle + keep fitting
    tree._mm = mm;
    const pane = svg.closest('.tab-pane');
    if (tree._ro) try { tree._ro.disconnect(); } catch(_) {}
    tree._ro = new ResizeObserver(() => { try { mm.fit(); } catch(_){} });
    if (pane) tree._ro.observe(pane);
    requestAnimationFrame(() => mm.fit());
  
    // Color links and tag classes (single-user too)
    setTimeout(() => requestAnimationFrame(() => this._colorLinksAndTagEdges(svg, mm)), 350);
    // Reapply on expand/collapse
    svg.addEventListener('click', () => {
      setTimeout(() => requestAnimationFrame(() => this._colorLinksAndTagEdges(svg, mm)), 250);
    });

    // ---------- NEW: rank-based edge coloring for single-user trees ----------
    // Palette per rank (tweak as you like)
    const RANK_COLOR = {
      species:    '#22c55e',
      subspecies: '#22c55e',
      variety:    '#22c55e',
      genus:      '#10b981',
      subgenus:   '#10b981',
      family:     '#06b6d4',
      subfamily:  '#06b6d4',
      order:      '#6366f1',
      suborder:   '#6366f1',
      class:      '#f59e0b',
      subclass:   '#f59e0b',
      phylum:     '#ef4444',
      subphylum:  '#ef4444',
      kingdom:    '#a855f7',
      domain:     '#a855f7',
      superkingdom: '#a855f7',
      stateofmatter: '#64748b'
    };
  
    const getRankColor = (gNode) => {
      // We emit <span class="mm-badge mm-rank" title="Class">C</span> in labels.
      const badge = gNode.querySelector('.mm-badge.mm-rank');
      if (!badge) return null;
      const rank = (badge.getAttribute('title') || '').trim().toLowerCase();
      return RANK_COLOR[rank] || null;
    };
  
    const colorByRank = () => {
      const colorByPath = new Map();
  
      // Color node visuals and record color per data-path
      svg.querySelectorAll('g.markmap-node').forEach((g) => {
        const c = getRankColor(g);
        if (!c) return;
  
        const pathKey = g.getAttribute('data-path');
        if (pathKey) colorByPath.set(pathKey, c);
  
        const line = g.querySelector('line');
        if (line) line.setAttribute('stroke', c);
  
        const circle = g.querySelector('circle');
        if (circle) { circle.setAttribute('stroke', c); circle.setAttribute('fill', c); }
      });
  
      // Paint the edges (real links)
      svg.querySelectorAll('path.markmap-link').forEach((linkEl) => {
        let pathKey = linkEl.getAttribute('data-path');
        let gNode = pathKey ? svg.querySelector(`g.markmap-node[data-path="${pathKey}"]`) : null;
  
        if (!gNode) {
          const d = linkEl.__data__;
          const target = d && d.target;
          if (target && target.path) {
            pathKey = target.path;
            gNode = svg.querySelector(`g.markmap-node[data-path="${pathKey}"]`);
          }
        }
  
        const c =
          (gNode && getRankColor(gNode)) ||
          (pathKey && colorByPath.get(pathKey)) ||
          null;
  
        if (!c) return;
  
        // Inline styles win over global CSS
        linkEl.setAttribute('stroke', c);
        linkEl.style.stroke = c;
        linkEl.style.strokeOpacity = '1';
        linkEl.style.fill = 'none';
      });
    };
  
    // Initial paint (after layout settles)
    setTimeout(() => requestAnimationFrame(colorByRank), 400);
    // Re-apply after expand/collapse
    svg.addEventListener('click', () => {
      setTimeout(() => requestAnimationFrame(colorByRank), 250);
    });
    // ------------------------------------------------------------------------
  
    // Install/update the floating toolbar
    this.installToolbar(tree, mm, root);
  
    // Add scroll gutters and mini-map
    this._ensureScrollGutters(svg.closest('.markmap-container'));
    this._ensureMiniMap(tree.id, svg);
  
    // Dark theme label polish
    try {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        setTimeout(() => {
          const texts = svg.querySelectorAll('text, tspan, .markmap-node text');
          texts.forEach(t => { t.setAttribute('fill', '#f8fafc'); t.style.opacity = '0.96'; });
          const foreign = svg.querySelectorAll('.markmap-foreign *');
          foreign.forEach(el => { el.style.color = '#f8fafc'; });
        }, 0);
      }
    } catch (_) {}
  
    // Stats dashboard (unchanged)
    try {
      const tabContent = document.getElementById(`${tree.id}-content`);
      const existingStats = tabContent.querySelectorAll('.taxonomy-stats');
      existingStats.forEach(el => el.remove());
      if (tree.stats && window.taxonomyStats) {
        const statsContainer = this.createStatsDashboard(tree);
        if (statsContainer) {
          const treeInfo = tabContent.querySelector('.tree-info');
          if (treeInfo) treeInfo.after(statsContainer);
          else tabContent.appendChild(statsContainer);
        }
      }
    } catch (error) {
      console.error('Error rendering statistics dashboard:', error);
    }
  }
  

  // Create statistics dashboard for a single tree
  createStatsDashboard(tree) {
    try {
      if (!window.taxonomyStats || !tree.stats) {
        return null;
      }
      // Create title based on tree data
      const title = `Taxonomic Statistics for ${tree.username} - ${tree.taxonName}`;
      return window.taxonomyStats.createStatsDashboard(tree.stats, title);
    } catch (error) {
      console.error('Error creating statistics dashboard:', error);
      return null;
    }
  }

  removeTree(treeId) {
    const index = this.trees.findIndex(t => t.id === treeId);
    if (index === -1) return;
    this.trees.splice(index, 1);
    const tabHeader = document.getElementById(`${treeId}-tab`).parentNode;
    const tabContent = document.getElementById(`${treeId}-content`);
    let activateTabId = null;
    if (tabHeader.querySelector('.nav-link').classList.contains('active')) {
      if (this.trees.length > 0) {
        activateTabId = this.trees[this.trees.length - 1].id;
      }
    }
    tabHeader.remove();
    tabContent.remove();
    if (activateTabId) {
      const tabToActivate = document.getElementById(`${activateTabId}-tab`);
      if (tabToActivate) {
        new bootstrap.Tab(tabToActivate).show();
      }
    }
    if (this.trees.length === 0) {
      document.getElementById('resultsCard').style.display = 'none';
    }
  }

  clearAllTrees() {
    if (!confirm('Are you sure you want to clear all trees?')) return;
    this.trees = [];
    this.tabsContainer.innerHTML = '';
    this.tabContentContainer.innerHTML = '';
    this.currentId = 0;
    document.getElementById('resultsCard').style.display = 'none';
  }

  // Updated: For comparison trees, we now only create one tab.
  addComparisonTree(username1, username2, taxonName, taxonId, markdown, existingStats = null) {
    const treeId = this.generateTreeId();

    // Process comparison markdown to extract statistics for both users
    let stats = existingStats;
    try {
      if (!stats && window.taxonomyStats && typeof window.taxonomyStats.processComparisonMarkdown === 'function') {
        stats = window.taxonomyStats.processComparisonMarkdown(markdown);
      }
    } catch (error) {
      console.error('Error processing comparison statistics:', error);
    }

    const tree = {
      id: treeId,
      username1,
      username2,
      taxonName,
      taxonId,
      markdown,
      stats,
      isComparison: true,
      timestamp: new Date()
    };
    this.trees.push(tree);
    this.createComparisonTreeTab(tree);
    return treeId;
  }

  createComparisonTreeTab(tree) {
    const tabHeader = document.createElement('li');
    tabHeader.className = 'nav-item';
    tabHeader.innerHTML = `
      <a class="nav-link" id="${tree.id}-tab" data-bs-toggle="tab" href="#${tree.id}-content" role="tab" 
         aria-controls="${tree.id}-content" aria-selected="false">
        <span class="tab-title">${this.formatComparisonTabTitle(tree)}</span>
        <button class="btn-close ms-2 btn-close-white text-sm" aria-label="Close" 
                style="font-size: 0.5rem; opacity: 0.5;" data-tree-id="${tree.id}"></button>
      </a>
    `;
    const tabContent = document.createElement('div');
    if (this.trees.length === 1) {
      tabContent.className = 'tab-pane fade show active';
      tabHeader.querySelector('a').setAttribute('aria-selected', 'true');
    } else {
      tabContent.className = 'tab-pane fade';
    }
    tabContent.id = `${tree.id}-content`;
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('aria-labelledby', `${tree.id}-tab`);
    // expose usernames for first-observation controller (comparison mode)
    tabContent.dataset.username1 = tree.username1;
    tabContent.dataset.username2 = tree.username2;
    const svgContainer = document.createElement('div');
    svgContainer.className = 'markmap-container';
    svgContainer.innerHTML = `<svg id="${tree.id}-svg" style="width: 100%; height: 700px;"></svg>`;
    tabContent.appendChild(svgContainer);
    this.tabsContainer.appendChild(tabHeader);
    this.tabContentContainer.appendChild(tabContent);
    const closeBtn = tabHeader.querySelector('.btn-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeTree(tree.id);
    });
    const tabTrigger = tabHeader.querySelector('a');
    tabTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      new bootstrap.Tab(tabTrigger).show();
    });
    // When the compare tab is shown, re-render the comparison tree
    tabTrigger.addEventListener('shown.bs.tab', () => {
      // Clear any existing renderers first to prevent memory leaks
      const svg = document.getElementById(`${tree.id}-svg`);
      if (svg) svg.innerHTML = '';

      setTimeout(() => {
        this.renderComparisonTree(tree);
      }, 100);
    });
    if (this.trees.length === 1) {
      new bootstrap.Tab(tabTrigger).show();
    }
  }

  formatComparisonTabTitle(tree) {
    let title = `${tree.username1} vs ${tree.username2}`;
    if (title.length > 25) {
      const maxLength = 10;
      const u1 = tree.username1.substring(0, maxLength);
      const u2 = tree.username2.substring(0, maxLength);
      title = `${u1} vs ${u2}`;
    }
    return title;
  }

  processComparisonMarkdown(markdown) {
    // Turn {color:*}...{/color} into spans Markmap can render as HTML labels
    return String(markdown)
      .replace(/\{color:red\}([\s\S]*?)\{\/color\}/g, '<span class="user1-node">$1</span>')
      .replace(/\{color:blue\}([\s\S]*?)\{\/color\}/g, '<span class="user2-node">$1</span>')
      .replace(/\{color:purple\}([\s\S]*?)\{\/color\}/g, '<span class="shared-node">$1</span>');
  }


  renderComparisonTree(tree) {
    const svg = document.getElementById(`${tree.id}-svg`);
    if (!svg) return;
    svg.innerHTML = '';
  
    const processedMarkdown = this.processComparisonMarkdown(tree.markdown);
    const { Transformer, Markmap } = window.markmap;
    const transformer = new Transformer();
    const { root } = transformer.transform(processedMarkdown);
  
    const mm = Markmap.create(svg, {
      htmlLabels: true,
      duration: 500,
      autoFit: true,
      fitRatio: 0.98,
      initialExpandLevel: -1,   // show full tree now
      pan: true,
      zoom: true,
      scrollForPan: true,
      color: (node) => {
        const hay = [node.v, node.content, node.payload?.content];
        for (const s of hay) {
          if (s && typeof s === 'string') {
            if (s.includes('user1-node')) return '#dc2626';
            if (s.includes('user2-node')) return '#2563eb';
            if (s.includes('shared-node')) return '#9333ea';
          }
        }
        return undefined;
      }
    }, root);

    // Keep a handle + keep fitting
    tree._mm = mm;
    const pane = svg.closest('.tab-pane');
    if (tree._ro) try { tree._ro.disconnect(); } catch(_) {}
    tree._ro = new ResizeObserver(() => { try { mm.fit(); } catch(_){} });
    if (pane) tree._ro.observe(pane);
    requestAnimationFrame(() => mm.fit());
  
    // Color links and tag classes (comparison too)
    setTimeout(() => requestAnimationFrame(() => this._colorLinksAndTagEdges(svg, mm)), 350);
    // Reapply on expand/collapse
    svg.addEventListener('click', () => {
      setTimeout(() => requestAnimationFrame(() => this._colorLinksAndTagEdges(svg, mm)), 250);
    });
  
    // Dark mode handling
    try {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        setTimeout(() => {
          const texts = svg.querySelectorAll('text, tspan, .markmap-node text');
          texts.forEach(t => { 
            t.setAttribute('fill', '#f8fafc');
            t.style.opacity = '0.96';
          });
          const foreign = svg.querySelectorAll('.markmap-foreign *');
          foreign.forEach(el => { el.style.color = '#f8fafc'; });
        }, 0);
      }
    } catch (_) {}
  
    // Stats dashboard (unchanged)
    const tabContent = document.getElementById(`${tree.id}-content`);
    if (tabContent) {
      const existingStats = tabContent.querySelectorAll('.comparison-stats, .battle-summary');
      existingStats.forEach(el => el.remove());
    }
    if (tree.stats && window.taxonomyStats) {
      try {
        const comparisonDashboard = window.taxonomyStats.createComparisonDashboard(
          tree.stats, tree.username1, tree.username2
        );
        if (comparisonDashboard && tabContent) {
          tabContent.appendChild(comparisonDashboard);
          this.applyComparisonStatsColors(tree);   // <— NEW
          this.createBattleSummary(tree);
        }

        // Install/update the floating toolbar
        this.installToolbar(tree, mm, root);

        // Add scroll gutters and mini-map
        this._ensureScrollGutters(svg.closest('.markmap-container'));
        this._ensureMiniMap(tree.id, svg);
        
      } catch (error) {
        console.error('Error creating comparison dashboard:', error);
      }
    }
  }
  

  createBattleSummary(tree) {
    // First, remove any existing battle-summary elements to prevent duplicates
    const tabContent = document.getElementById(`${tree.id}-content`);
    const existingBattleSummary = tabContent?.querySelector('.battle-summary');
    if (existingBattleSummary) existingBattleSummary.remove();
  
    // App colors (same as your markmap palette)
    const COLOR_USER1  = '#dc2626'; // red
    const COLOR_USER2  = '#2563eb'; // blue
    const COLOR_SHARED = '#9333ea'; // purple
  
    const statsContainer = document.createElement('div');
    statsContainer.className = 'battle-summary mt-4';
  
    // Use the statistics data if available
    let user1Count = 0, user2Count = 0, user1Only = 0, user2Only = 0, shared = 0;
  
    if (tree.stats && tree.stats.user1 && tree.stats.user2 && tree.stats.shared) {
      user1Count = tree.stats.user1.withShared.total || 0;
      user2Count = tree.stats.user2.withShared.total || 0;
      user1Only  = tree.stats.user1.unique.total     || 0;
      user2Only  = tree.stats.user2.unique.total     || 0;
      shared     = tree.stats.shared.total           || 0;
    } else if (tree.stats) {
      // Fallback to the original stats format if available
      user1Count = tree.stats.user1Total || 0;
      user2Count = tree.stats.user2Total || 0;
      user1Only  = tree.stats.user1Only  || 0;
      user2Only  = tree.stats.user2Only  || 0;
      shared     = tree.stats.shared     || 0;
    }
  
    const total = user1Only + user2Only + shared;
    const user1Percent  = total > 0 ? Math.round((user1Only / total) * 100) : 0;
    const user2Percent  = total > 0 ? Math.round((user2Only / total) * 100) : 0;
    const sharedPercent = total > 0 ? Math.round((shared    / total) * 100) : 0;
  
    // Render
    statsContainer.innerHTML = `
      <div class="battle-summary-header">
        <div class="battle-user battle-user-1">
          <div class="battle-user-avatar">${tree.username1.charAt(0).toUpperCase()}</div>
          <div class="battle-user-name">${tree.username1}</div>
        </div>
        <div class="battle-vs">VS</div>
        <div class="battle-user battle-user-2">
          <div class="battle-user-avatar">${tree.username2.charAt(0).toUpperCase()}</div>
          <div class="battle-user-name">${tree.username2}</div>
        </div>
      </div>
      <div class="battle-stats">
        <div class="battle-stat battle-stat-user1">
          <div class="battle-stat-value">${user1Only}</div>
          <div class="battle-stat-label">Unique to ${tree.username1}</div>
        </div>
        <div class="battle-stat battle-stat-shared">
          <div class="battle-stat-value">${shared}</div>
          <div class="battle-stat-label">Shared</div>
        </div>
        <div class="battle-stat battle-stat-user2">
          <div class="battle-stat-value">${user2Only}</div>
          <div class="battle-stat-label">Unique to ${tree.username2}</div>
        </div>
      </div>
      <div class="battle-progress">
        <div class="battle-progress-bar user1-bar"  style="width:${user1Percent}%;">${user1Percent}%</div>
        <div class="battle-progress-bar shared-bar" style="width:${sharedPercent}%;">${sharedPercent}%</div>
        <div class="battle-progress-bar user2-bar"  style="width:${user2Percent}%;">${user2Percent}%</div>
      </div>
    `;
  
    // Apply consistent colors (light & dark themes)
    const applyColors = (root) => {
      // Avatars
      const av1 = root.querySelector('.battle-user-1 .battle-user-avatar');
      const av2 = root.querySelector('.battle-user-2 .battle-user-avatar');
      if (av1) { av1.style.background = COLOR_USER1; av1.style.color = '#fff'; }
      if (av2) { av2.style.background = COLOR_USER2; av2.style.color = '#fff'; }
  
      // Numbers
      const v1 = root.querySelector('.battle-stat-user1 .battle-stat-value');
      const vs = root.querySelector('.battle-stat-shared .battle-stat-value');
      const v2 = root.querySelector('.battle-stat-user2 .battle-stat-value');
      if (v1) v1.style.color = COLOR_USER1;
      if (vs) vs.style.color = COLOR_SHARED;
      if (v2) v2.style.color = COLOR_USER2;
  
      // Labels (subtle tint)
      const l1 = root.querySelector('.battle-stat-user1 .battle-stat-label');
      const ls = root.querySelector('.battle-stat-shared .battle-stat-label');
      const l2 = root.querySelector('.battle-stat-user2 .battle-stat-label');
      if (l1) l1.style.color = COLOR_USER1 + 'cc';
      if (ls) ls.style.color = COLOR_SHARED + 'cc';
      if (l2) l2.style.color = COLOR_USER2 + 'cc';
  
      // Progress bars
      const pb1 = root.querySelector('.battle-progress .user1-bar');
      const pbs = root.querySelector('.battle-progress .shared-bar');
      const pb2 = root.querySelector('.battle-progress .user2-bar');
      if (pb1) pb1.style.background = COLOR_USER1;
      if (pbs) pbs.style.background = COLOR_SHARED;
      if (pb2) pb2.style.background = COLOR_USER2;
  
      // Optional: a thin accent border that stays visible in dark mode
      root.style.borderLeft = `4px solid ${COLOR_USER1}`;
      root.style.borderRight = `4px solid ${COLOR_USER2}`;
      root.style.borderRadius = '10px';
      root.style.paddingLeft = '8px';
      root.style.paddingRight = '8px';
    };
  
    if (tabContent) {
      tabContent.appendChild(statsContainer);
      applyColors(statsContainer);
    }
  }

  // Force user colors in the comparison dashboard (works in dark & light)
  applyComparisonStatsColors(tree) {
    const tabContent = document.getElementById(`${tree.id}-content`);
    const root = tabContent?.querySelector('.comparison-stats');
    if (!root) return;

    // Same palette you use for nodes/links
    const COLOR_USER1  = '#dc2626'; // red
    const COLOR_USER2  = '#2563eb'; // blue
    const COLOR_SHARED = '#9333ea'; // purple

    // Find the panel that contains "<username>'s Observations"
    const findPanelByHeading = (username) => {
      const needle = `${username}'s Observations`;
      let headingEl = null;

      // Find the element that contains the heading text
      root.querySelectorAll('*').forEach(el => {
        if (!headingEl && el.firstElementChild && el.textContent && el.textContent.includes(needle)) {
          headingEl = el;
        }
      });
      if (!headingEl) return null;

      // Walk up until we hit a direct child "panel" under the comparison root
      let p = headingEl;
      while (p && p.parentElement && p.parentElement !== root) p = p.parentElement;
      return p || headingEl;
    };

    const paintPanel = (panel, color) => {
      if (!panel) return;

      // Accent borders so the column is clearly tied to the user color
      panel.style.setProperty('border-left',  `4px solid ${color}`, 'important');
      panel.style.setProperty('border-radius', '10px');
      panel.style.setProperty('padding-left', '8px');

      // Color the big numbers (and any other numeric KPIs)
      // We apply with !important to override dark-theme palette.
      const maybeNumbers = panel.querySelectorAll(
        '.stat-value, .value, .count, .metric-value, .big-number, .kpi-value, .summary-number, .card .display-4, .card h1, .card h2, .card .h1, .card .h2, *'
      );
      maybeNumbers.forEach(el => {
        const txt = (el.textContent || '').trim();
        if (/^\d{1,4}$/.test(txt)) {
          el.style.setProperty('color', color, 'important');
        }
      });

      // Also tint any progress/underline accents if present
      panel.querySelectorAll('.progress-bar, .bar, .underline, .accent').forEach(el => {
        el.style.setProperty('background', color, 'important');
        el.style.setProperty('border-color', color, 'important');
      });
    };

    const panel1 = findPanelByHeading(tree.username1);
    const panel2 = findPanelByHeading(tree.username2);

    paintPanel(panel1, COLOR_USER1);
    paintPanel(panel2, COLOR_USER2);

    // If there are any "Shared" labels/values in the dashboard, tint them purple
    root.querySelectorAll('*').forEach(el => {
      const t = (el.textContent || '').trim();
      if (/^shared$/i.test(t)) {
        el.style.setProperty('color', COLOR_SHARED, 'important');
      }
    });
  }

  installToolbar(tree, mm, root) {
    const tabContent = document.getElementById(`${tree.id}-content`);
    if (!tabContent) return;

    // Remove an old toolbar if we re-rendered
    const old = tabContent.querySelector('.mm-toolbar');
    if (old) old.remove();

    const toolbar = document.createElement('div');
    toolbar.className = 'mm-toolbar';
    toolbar.innerHTML = `
      <button class="btn btn-sm btn-light" data-act="fit" title="Fit">
        <i class="bi bi-aspect-ratio"></i>
      </button>
      <select class="form-select form-select-sm w-auto" data-act="expand" title="Expand level">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="-1">All</option>
      </select>
      <button class="btn btn-sm btn-light" data-act="center" title="Center root">
        <i class="bi bi-crosshair"></i>
      </button>
    `;
    tabContent.appendChild(toolbar);

    // Init expand select from storage
    const sel = toolbar.querySelector('[data-act="expand"]');
    sel.value = String(localStorage.getItem('mm_expand_level') ?? 2);

    // Wire up actions
    toolbar.querySelector('[data-act="fit"]')
      .addEventListener('click', () => { try { mm.fit(); } catch(_){} });

    sel.addEventListener('change', (e) => {
      const v = Number(e.target.value);
      localStorage.setItem('mm_expand_level', String(v));
      try {
        mm.setOptions({ initialExpandLevel: v });
        mm.renderData(root);
        requestAnimationFrame(() => mm.fit());
      } catch (_) {}
    });

    toolbar.querySelector('[data-act="center"]')
      .addEventListener('click', async () => {
        try {
          if (typeof mm.centerNode === 'function') await mm.centerNode(mm.state.data);
          else mm.fit();
        } catch(_) { mm.fit(); }
      });
  }

  // Always keep page-scrollable gutters around the map
  _ensureScrollGutters(host) {
    if (!host) return;
    if (!host.querySelector('.mm-scroll-gutter.left')) {
      host.appendChild(Object.assign(document.createElement('div'), { className: 'mm-scroll-gutter left' }));
    }
    if (!host.querySelector('.mm-scroll-gutter.right')) {
      host.appendChild(Object.assign(document.createElement('div'), { className: 'mm-scroll-gutter right' }));
    }
  }

  // Mini-map with live viewport; mirrors link colors (user1/user2/shared)
  _ensureMiniMap(treeId, svg) {
    const host = svg.closest('.markmap-container');
    if (!host) return;

    const NS = 'http://www.w3.org/2000/svg';
    let mini = host.querySelector('.mm-minimap');
    if (!mini) {
      mini = document.createElementNS(NS, 'svg');
      mini.classList.add('mm-minimap');
      mini.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      const linksLayer = document.createElementNS(NS, 'g');
      linksLayer.classList.add('mm-mini-links');
      mini.appendChild(linksLayer);
      const vp = document.createElementNS(NS, 'rect');
      vp.classList.add('mm-mini-viewport');
      mini.appendChild(vp);
      host.appendChild(mini);
    }

    const linksLayer = mini.querySelector('.mm-mini-links');
    const vpRect     = mini.querySelector('.mm-mini-viewport');

    const getContentBBox = () => {
      const els = svg.querySelectorAll('path.markmap-link, g.markmap-node');
      let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      els.forEach(el => {
        try {
          const b = el.getBBox();
          x1 = Math.min(x1, b.x);
          y1 = Math.min(y1, b.y);
          x2 = Math.max(x2, b.x + b.width);
          y2 = Math.max(y2, b.y + b.height);
        } catch(_) {}
      });
      if (!isFinite(x1)) return { x: 0, y: 0, width: 100, height: 100 };
      return { x: x1, y: y1, width: (x2 - x1), height: (y2 - y1) };
    };

    // Rebuild mini links; copy d + color classes so they match the main map
    const rebuildMiniLinks = () => {
      linksLayer.innerHTML = '';
      svg.querySelectorAll('path.markmap-link').forEach(p => {
        const miniPath = document.createElementNS(NS, 'path');
        miniPath.setAttribute('d', p.getAttribute('d') || '');
    
        // Copy edge classes (keeps PVP coloring when present)
        const cls = p.getAttribute('class') || '';
        const keep = cls.split(/\s+/).filter(c =>
          c === 'user1-edge' || c === 'user2-edge' || c === 'shared-edge'
        );
        if (keep.length) miniPath.setAttribute('class', keep.join(' '));
    
        // NEW: also copy the actual stroke color for single-user rank colors
        const stroke = p.style.stroke || p.getAttribute('stroke');
        if (stroke) miniPath.setAttribute('stroke', stroke);
        const sop = p.style.strokeOpacity || p.getAttribute('stroke-opacity');
        if (sop) miniPath.setAttribute('stroke-opacity', sop);
    
        linksLayer.appendChild(miniPath);
      });
    };
    

    const updateViewport = () => {
      const bbox = getContentBBox();
      mini.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

      const contentG = svg.querySelector('g') || svg;
      const ctm = contentG.getCTM && contentG.getCTM();
      if (!ctm) return;

      const inv = ctm.inverse();
      const pt = svg.createSVGPoint();
      pt.x = 0; pt.y = 0;
      const tl = pt.matrixTransform(inv);
      pt.x = svg.clientWidth; pt.y = svg.clientHeight;
      const br = pt.matrixTransform(inv);

      const vx = Math.min(tl.x, br.x);
      const vy = Math.min(tl.y, br.y);
      const vw = Math.abs(br.x - tl.x);
      const vh = Math.abs(br.y - tl.y);

      vpRect.setAttribute('x', vx);
      vpRect.setAttribute('y', vy);
      vpRect.setAttribute('width',  vw);
      vpRect.setAttribute('height', vh);
    };

    // Build now
    rebuildMiniLinks();
    updateViewport();

    // Watch DOM changes (expand/collapse) to re-sync paths and viewport
    if (!host._miniObserver) {
      const mo = new MutationObserver(() => {
        clearTimeout(host._miniDeb);
        host._miniDeb = setTimeout(() => { rebuildMiniLinks(); updateViewport(); }, 120);
      });
      mo.observe(svg, { subtree: true, childList: true, attributes: true, attributeFilter: ['d','transform','class'] });
      host._miniObserver = mo;
    }
    // Recompute viewport on size/interaction
    if (!host._miniResize) {
      const ro = new ResizeObserver(updateViewport);
      ro.observe(svg);
      host._miniResize = ro;
    }
    try {
      if (window.d3 && window.d3.select) {
        window.d3.select(svg).on('zoom.mmMini', () => requestAnimationFrame(updateViewport));
      } else {
        ['wheel','pointermove','pointerup','transitionend'].forEach(ev =>
          svg.addEventListener(ev, () => requestAnimationFrame(updateViewport), { passive: true })
        );
      }
    } catch(_) {}
  }

  // Infer user color from a node's HTML label, if present
  _inferNodeColorFromG(g) {
    if (!g) return null;
    const f = g.querySelector('foreignObject');
    if (!f) return null;
    if (f.querySelector('.shared-node')) return '#9333ea';
    if (f.querySelector('.user1-node'))  return '#dc2626';
    if (f.querySelector('.user2-node'))  return '#2563eb';
    return null;
  }

  /** Paint markmap links to match node/user colors and tag classes for mini-map. */
  _colorLinksAndTagEdges(svg, mm) {
    if (!svg) return;

    // Map data-path → color
    const colorByPath = new Map();
    svg.querySelectorAll('g.markmap-node').forEach(g => {
      const key = g.getAttribute('data-path');
      const c = this._inferNodeColorFromG(g);
      if (key && c) colorByPath.set(key, c);

      // Also tint the short connector line
      const ln = g.querySelector('line');
      if (ln && c) {
        ln.setAttribute('stroke', c);
        ln.style.stroke = c;
      }
    });

    // Color the curved links and tag classes
    svg.querySelectorAll('path.markmap-link').forEach(linkEl => {
      let c = null;

      // Prefer data-path
      const key = linkEl.getAttribute('data-path');
      if (key && colorByPath.has(key)) c = colorByPath.get(key);

      // Fallback: use bound datum + mm.findElement
      if (!c) {
        const d = linkEl.__data__;
        const target = d && d.target;
        if (target && typeof mm?.findElement === 'function') {
          try {
            const el = mm.findElement(target);
            if (el?.g) c = this._inferNodeColorFromG(el.g);
          } catch (_) {}
        }
      }

      if (!c) return;

      linkEl.setAttribute('stroke', c);
      linkEl.style.stroke = c;
      linkEl.style.strokeOpacity = '1';
      linkEl.style.fill = 'none';

      linkEl.classList.remove('user1-edge', 'user2-edge', 'shared-edge');
      if (c === '#dc2626') linkEl.classList.add('user1-edge');
      else if (c === '#2563eb') linkEl.classList.add('user2-edge');
      else if (c === '#9333ea') linkEl.classList.add('shared-edge');
    });
  }
}

// Initialize as a global variable
window.treeManager = new TreeManager();