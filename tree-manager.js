// tree-manager.js
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
    const mm = Markmap.create(svg, { htmlLabels: true }, root);
    try {
      // ensure labels are bright in dark theme (html labels too)
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

    // Add statistics dashboard if available
    try {
      // First, remove any existing stats containers to prevent duplicates
      const tabContent = document.getElementById(`${tree.id}-content`);
      const existingStats = tabContent.querySelectorAll('.taxonomy-stats');
      existingStats.forEach(el => el.remove());

      // Check if stats are available and the taxonomyStats module is loaded
      if (tree.stats && window.taxonomyStats) {
        const statsContainer = this.createStatsDashboard(tree);
        if (statsContainer) {
          // Insert the stats dashboard after the tree info (if it exists)
          const treeInfo = tabContent.querySelector('.tree-info');
          if (treeInfo) {
            treeInfo.after(statsContainer);
          } else {
            tabContent.appendChild(statsContainer);
          }
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
      color: (node) => {
        const searchIn = [node.v, node.content, node.payload?.content, JSON.stringify(node)];
        for (const str of searchIn) {
          if (str && typeof str === 'string') {
            if (str.includes('user1-node')) return '#dc2626';
            if (str.includes('user2-node')) return '#2563eb';
            if (str.includes('shared-node')) return '#9333ea';
          }
        }
        return null;
      },
      duration: 500
    }, root);
    
    // Color ALL paths based on their associated nodes
    setTimeout(() => {
      // Build a map of which color each node should be
      const nodeColors = new Map();
      const nodes = svg.querySelectorAll('g.markmap-node');
      
      nodes.forEach(node => {
        const foreign = node.querySelector('foreignObject');
        if (foreign) {
          const has1 = !!foreign.querySelector('.user1-node');
          const has2 = !!foreign.querySelector('.user2-node');
          const hasShared = !!foreign.querySelector('.shared-node');
          
          let color = null;
          if (hasShared || (has1 && has2)) color = '#9333ea';
          else if (has1) color = '#dc2626';
          else if (has2) color = '#2563eb';
          
          if (color) {
            nodeColors.set(node, color);
            
            // Color any circles in this node
            const circle = node.querySelector('circle');
            if (circle) {
              circle.setAttribute('stroke', color);
              circle.setAttribute('fill', color);
            }
          }
        }
      });
      
      // Now color ALL path elements
      const allPaths = svg.querySelectorAll('path');
      allPaths.forEach(path => {
        // Check if this path is a markmap-link
        if (path.classList.contains('markmap-link') || !path.classList.length) {
          // Find the closest following node
          let nextElement = path.nextElementSibling;
          while (nextElement) {
            if (nextElement.classList.contains('markmap-node')) {
              const color = nodeColors.get(nextElement);
              if (color) {
                path.setAttribute('stroke', color);
              }
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
          
          // If no next sibling found, check if path is inside a group
          if (!nextElement) {
            const parentGroup = path.parentElement;
            if (parentGroup && parentGroup.tagName === 'g') {
              // Look for node siblings of the parent group
              let sibling = parentGroup.nextElementSibling;
              while (sibling) {
                if (sibling.classList.contains('markmap-node')) {
                  const color = nodeColors.get(sibling);
                  if (color) {
                    path.setAttribute('stroke', color);
                  }
                  break;
                }
                sibling = sibling.nextElementSibling;
              }
            }
          }
        }
      });
      
      // One more pass: color any remaining gray paths based on proximity
      const grayPaths = svg.querySelectorAll('path[stroke="#c0c0c0"], path:not([stroke])');
      grayPaths.forEach(path => {
        // Get the path's bounding box
        const bbox = path.getBBox();
        const pathCenterX = bbox.x + bbox.width / 2;
        const pathCenterY = bbox.y + bbox.height / 2;
        
        // Find the closest colored node
        let closestNode = null;
        let closestDistance = Infinity;
        
        nodeColors.forEach((color, node) => {
          const nodeBBox = node.getBBox();
          const nodeCenterX = nodeBBox.x + nodeBBox.width / 2;
          const nodeCenterY = nodeBBox.y + nodeBBox.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(pathCenterX - nodeCenterX, 2) + 
            Math.pow(pathCenterY - nodeCenterY, 2)
          );
        
          if (distance < closestDistance) {
            closestDistance = distance;
            closestNode = node;
          }
        });
        
        if (closestNode && closestDistance < 200) { // 200px proximity threshold
          const color = nodeColors.get(closestNode);
          if (color) {
            path.setAttribute('stroke', color);
          }
        }
      });
    }, 200); // Slightly longer delay to ensure rendering is complete
    
    try {
      // Handle dark mode text visibility
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        setTimeout(() => {
          const texts = svg.querySelectorAll('text, tspan, .markmap-node text');
          texts.forEach(t => { 
            t.setAttribute('fill', '#f8fafc'); 
            t.style.opacity = '0.96'; 
          });
          const foreign = svg.querySelectorAll('.markmap-foreign *');
          foreign.forEach(el => { 
            el.style.color = '#f8fafc'; 
          });
        }, 0);
      }
    } catch (_) {}
  
    // Remove any existing statistics elements to prevent duplicates
    const tabContent = document.getElementById(`${tree.id}-content`);
    if (tabContent) {
      const existingStats = tabContent.querySelectorAll('.comparison-stats, .battle-summary');
      existingStats.forEach(el => el.remove());
    }
  
    // Add comparison statistics dashboard
    if (tree.stats && window.taxonomyStats) {
      try {
        const comparisonDashboard = window.taxonomyStats.createComparisonDashboard(
          tree.stats, tree.username1, tree.username2
        );
        if (comparisonDashboard && tabContent) {
          tabContent.appendChild(comparisonDashboard);
        }
      } catch (error) {
        console.error('Error creating comparison dashboard:', error);
      }
    }
  }

  createBattleSummary(tree) {
    // First, remove any existing battle-summary elements to prevent duplicates
    const tabContent = document.getElementById(`${tree.id}-content`);
    const existingBattleSummary = tabContent.querySelector('.battle-summary');
    if (existingBattleSummary) {
      existingBattleSummary.remove();
    }

    const statsContainer = document.createElement('div');
    statsContainer.className = 'battle-summary mt-4';

    // Use the statistics data if available
    let user1Count = 0;
    let user2Count = 0;
    let user1Only = 0;
    let user2Only = 0;
    let shared = 0;

    if (tree.stats && tree.stats.user1 && tree.stats.user2 && tree.stats.shared) {
      user1Count = tree.stats.user1.withShared.total || 0;
      user2Count = tree.stats.user2.withShared.total || 0;
      user1Only = tree.stats.user1.unique.total || 0;
      user2Only = tree.stats.user2.unique.total || 0;
      shared = tree.stats.shared.total || 0;
    } else if (tree.stats) {
      // Fallback to the original stats format if available
      user1Count = tree.stats.user1Total || 0;
      user2Count = tree.stats.user2Total || 0;
      user1Only = tree.stats.user1Only || 0;
      user2Only = tree.stats.user2Only || 0;
      shared = tree.stats.shared || 0;
    }

    const total = user1Only + user2Only + shared;
    const user1Percent = total > 0 ? Math.round((user1Only / total) * 100) : 0;
    const user2Percent = total > 0 ? Math.round((user2Only / total) * 100) : 0;
    const sharedPercent = total > 0 ? Math.round((shared / total) * 100) : 0;

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
        <div class="battle-stat">
          <div class="battle-stat-value">${user1Only}</div>
          <div class="battle-stat-label">Unique to ${tree.username1}</div>
        </div>
        <div class="battle-stat">
          <div class="battle-stat-value">${shared}</div>
          <div class="battle-stat-label">Shared</div>
        </div>
        <div class="battle-stat">
          <div class="battle-stat-value">${user2Only}</div>
          <div class="battle-stat-label">Unique to ${tree.username2}</div>
        </div>
      </div>
      <div class="battle-progress">
        <div class="battle-progress-bar user1-bar" style="width:${user1Percent}%;">${user1Percent}%</div>
        <div class="battle-progress-bar shared-bar" style="width:${sharedPercent}%;">${sharedPercent}%</div>
        <div class="battle-progress-bar user2-bar" style="width:${user2Percent}%;">${user2Percent}%</div>
      </div>
    `;

    if (tabContent) {
      tabContent.appendChild(statsContainer);
    }
  }
}

// Initialize as a global variable
window.treeManager = new TreeManager();