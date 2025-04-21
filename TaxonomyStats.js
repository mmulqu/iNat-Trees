// TaxonomyStats.js - Module for analyzing and displaying taxonomic statistics

class TaxonomyStats {
  constructor() {
    // Initialize the CSS styles once
    this.initializeStyles();
  }

  initializeStyles() {
    // Add CSS styles for the stats dashboard if not already added
    if (!document.getElementById('taxonomy-stats-styles')) {
      const style = document.createElement('style');
      style.id = 'taxonomy-stats-styles';
      style.textContent = `
        .taxonomy-stats {
          background-color: #f8f9fa;
          border-radius: 8px;
          margin: 15px 0;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          border-left: 4px solid #3fac8c;
        }
        .taxonomy-stats-title {
          font-weight: bold;
          color: #2d7d64;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .taxonomy-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .taxonomy-stat-card {
          background-color: white;
          border-radius: 6px;
          padding: 12px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .taxonomy-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .taxonomy-stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #3fac8c;
          margin: 4px 0;
        }
        .taxonomy-stat-label {
          font-size: 0.9rem;
          color: #666;
        }
        .taxonomy-stat-change {
          font-size: 0.8rem;
          margin-top: 5px;
        }
        .increase {
          color: #2ecc71;
        }
        .decrease {
          color: #e74c3c;
        }
        .comparison-stats {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
        }
        .user-stats {
          flex: 1;
          min-width: 300px;
        }
        .user1-stats {
          border-left-color: #ff6b6b;
        }
        .user1-stats .taxonomy-stat-value {
          color: #ff6b6b;
        }
        .user2-stats {
          border-left-color: #4dabf7;
        }
        .user2-stats .taxonomy-stat-value {
          color: #4dabf7;
        }
        .winner-badge {
          display: inline-block;
          background-color: #ffd700;
          color: #333;
          font-size: 0.7rem;
          padding: 2px 5px;
          border-radius: 3px;
          margin-left: 5px;
          vertical-align: middle;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Process a tree markdown to extract taxonomy counts
  processMarkdown(markdown) {
    // Split by lines
    const lines = markdown.split('\n').filter(line => line.trim() !== '');

    const stats = {
      total: 0,
      species: 0,
      genera: 0,
      families: 0,
      orders: 0,
      classes: 0,
      phyla: 0,
    };

    // Dictionary to keep track of unique taxa
    const uniqueTaxa = {
      species: new Set(),
      genus: new Set(),
      family: new Set(),
      order: new Set(),
      class: new Set(),
      phylum: new Set(),
    };

    // Process each line to extract taxonomic information
    lines.forEach(line => {
      // Only count leaf nodes as observations
      const isLeafNode = !lines.some(otherLine => {
        return otherLine !== line && 
               otherLine.indexOf(line) === 0 &&
               otherLine.length > line.length;
      });

      if (isLeafNode) {
        stats.total++;
      }

      // Extract rank information
      const rankMatch = line.match(/\[(.*?)\]/);
      if (rankMatch) {
        const rank = rankMatch[1].toLowerCase();
        const nameMatch = line.match(/- (.*?)( \(|$|\[)/);
        const name = nameMatch ? nameMatch[1].trim() : "";

        // Remove any markdown color tags if present
        const cleanName = name.replace(/\{color:.*?\}|\{\/color\}/g, '');

        // Add to appropriate sets based on rank
        if (rank === 'species' || rank === 'subspecies' || rank === 'variety') {
          uniqueTaxa.species.add(cleanName);
        } else if (rank === 'genus' || rank === 'subgenus') {
          uniqueTaxa.genus.add(cleanName);
        } else if (rank === 'family' || rank === 'subfamily') {
          uniqueTaxa.family.add(cleanName);
        } else if (rank === 'order' || rank === 'suborder') {
          uniqueTaxa.order.add(cleanName);
        } else if (rank === 'class' || rank === 'subclass') {
          uniqueTaxa.class.add(cleanName);
        } else if (rank === 'phylum' || rank === 'subphylum') {
          uniqueTaxa.phylum.add(cleanName);
        }
      }
    });

    // Update stats with unique counts
    stats.species = uniqueTaxa.species.size;
    stats.genera = uniqueTaxa.genus.size;
    stats.families = uniqueTaxa.family.size;
    stats.orders = uniqueTaxa.order.size;
    stats.classes = uniqueTaxa.class.size;
    stats.phyla = uniqueTaxa.phylum.size;

    return stats;
  }

  // Process comparison tree to extract stats for each user
  processComparisonMarkdown(markdown) {
    // Extract user-specific parts by color tags
    const user1Lines = markdown.split('\n')
      .filter(line => line.includes('{color:red}'))
      .map(line => line.replace(/\{color:red\}|\{\/color\}/g, ''));

    const user2Lines = markdown.split('\n')
      .filter(line => line.includes('{color:blue}'))
      .map(line => line.replace(/\{color:blue\}|\{\/color\}/g, ''));

    const sharedLines = markdown.split('\n')
      .filter(line => line.includes('{color:purple}'))
      .map(line => line.replace(/\{color:purple\}|\{\/color\}/g, ''));

    // Create separate markdown for each user for processing
    const user1Markdown = user1Lines.join('\n');
    const user2Markdown = user2Lines.join('\n');
    const sharedMarkdown = sharedLines.join('\n');

    // Process each markdown separately
    const user1Stats = this.processMarkdown(user1Markdown);
    const user2Stats = this.processMarkdown(user2Markdown);
    const sharedStats = this.processMarkdown(sharedMarkdown);

    // Combine shared counts with each user
    return {
      user1: {
        unique: user1Stats,
        withShared: {
          total: user1Stats.total + sharedStats.total,
          species: user1Stats.species + sharedStats.species,
          genera: user1Stats.genera + sharedStats.genera,
          families: user1Stats.families + sharedStats.families,
          orders: user1Stats.orders + sharedStats.orders,
          classes: user1Stats.classes + sharedStats.classes,
          phyla: user1Stats.phyla + sharedStats.phyla,
        }
      },
      user2: {
        unique: user2Stats,
        withShared: {
          total: user2Stats.total + sharedStats.total,
          species: user2Stats.species + sharedStats.species,
          genera: user2Stats.genera + sharedStats.genera,
          families: user2Stats.families + sharedStats.families,
          orders: user2Stats.orders + sharedStats.orders,
          classes: user2Stats.classes + sharedStats.classes,
          phyla: user2Stats.phyla + sharedStats.phyla,
        }
      },
      shared: sharedStats
    };
  }

  // Create a statistics dashboard for a single user
  createStatsDashboard(stats, title) {
    const container = document.createElement('div');
    container.className = 'taxonomy-stats';

    const titleEl = document.createElement('div');
    titleEl.className = 'taxonomy-stats-title';
    titleEl.textContent = title || 'Taxonomic Statistics';
    container.appendChild(titleEl);

    const grid = document.createElement('div');
    grid.className = 'taxonomy-stats-grid';

    // Add stat cards
    grid.appendChild(this.createStatCard('Observations', stats.total));
    grid.appendChild(this.createStatCard('Species', stats.species));
    grid.appendChild(this.createStatCard('Genera', stats.genera));
    grid.appendChild(this.createStatCard('Families', stats.families));

    // Only include higher taxonomic ranks if they have values
    if (stats.orders > 0) {
      grid.appendChild(this.createStatCard('Orders', stats.orders));
    }
    if (stats.classes > 0) {
      grid.appendChild(this.createStatCard('Classes', stats.classes));
    }
    if (stats.phyla > 0) {
      grid.appendChild(this.createStatCard('Phyla', stats.phyla));
    }

    container.appendChild(grid);
    return container;
  }

  // Create a single stat card
  createStatCard(label, value, change = null) {
    const card = document.createElement('div');
    card.className = 'taxonomy-stat-card';

    const valueEl = document.createElement('div');
    valueEl.className = 'taxonomy-stat-value';
    valueEl.textContent = value.toLocaleString();

    const labelEl = document.createElement('div');
    labelEl.className = 'taxonomy-stat-label';
    labelEl.textContent = label;

    card.appendChild(valueEl);
    card.appendChild(labelEl);

    // Add change indicator if provided
    if (change !== null) {
      const changeEl = document.createElement('div');
      changeEl.className = `taxonomy-stat-change ${change > 0 ? 'increase' : change < 0 ? 'decrease' : ''}`;
      changeEl.textContent = change > 0 ? `+${change}` : change;
      card.appendChild(changeEl);
    }

    return card;
  }

  // Create a comparison dashboard for two users
  createComparisonDashboard(comparisonStats, username1, username2) {
    const container = document.createElement('div');
    container.className = 'comparison-stats';

    // Stats for user 1
    const user1Container = document.createElement('div');
    user1Container.className = 'taxonomy-stats user-stats user1-stats';

    const user1Title = document.createElement('div');
    user1Title.className = 'taxonomy-stats-title';
    user1Title.textContent = `${username1}'s Observations`;
    user1Container.appendChild(user1Title);

    const user1Grid = document.createElement('div');
    user1Grid.className = 'taxonomy-stats-grid';

    // Create stat cards for user 1
    const stats1 = comparisonStats.user1.withShared;
    const uniqueStats1 = comparisonStats.user1.unique;
    this.addComparisonStatCards(user1Grid, stats1, uniqueStats1, comparisonStats.user2.withShared);

    user1Container.appendChild(user1Grid);
    container.appendChild(user1Container);

    // Stats for user 2
    const user2Container = document.createElement('div');
    user2Container.className = 'taxonomy-stats user-stats user2-stats';

    const user2Title = document.createElement('div');
    user2Title.className = 'taxonomy-stats-title';
    user2Title.textContent = `${username2}'s Observations`;
    user2Container.appendChild(user2Title);

    const user2Grid = document.createElement('div');
    user2Grid.className = 'taxonomy-stats-grid';

    // Create stat cards for user 2
    const stats2 = comparisonStats.user2.withShared;
    const uniqueStats2 = comparisonStats.user2.unique;
    this.addComparisonStatCards(user2Grid, stats2, uniqueStats2, comparisonStats.user1.withShared);

    user2Container.appendChild(user2Grid);
    container.appendChild(user2Container);

    return container;
  }

  // Add stat cards to a comparison grid with uniqueness info
  addComparisonStatCards(grid, stats, uniqueStats, otherUserStats) {
    // Add each statistic with uniqueness information
    this.addComparisonStatCard(grid, 'Observations', stats.total, uniqueStats.total, otherUserStats.total);
    this.addComparisonStatCard(grid, 'Species', stats.species, uniqueStats.species, otherUserStats.species);
    this.addComparisonStatCard(grid, 'Genera', stats.genera, uniqueStats.genera, otherUserStats.genera);
    this.addComparisonStatCard(grid, 'Families', stats.families, uniqueStats.families, otherUserStats.families);

    // Add higher taxonomic ranks if they exist
    if (stats.orders > 0 || otherUserStats.orders > 0) {
      this.addComparisonStatCard(grid, 'Orders', stats.orders, uniqueStats.orders, otherUserStats.orders);
    }
    if (stats.classes > 0 || otherUserStats.classes > 0) {
      this.addComparisonStatCard(grid, 'Classes', stats.classes, uniqueStats.classes, otherUserStats.classes);
    }
    if (stats.phyla > 0 || otherUserStats.phyla > 0) {
      this.addComparisonStatCard(grid, 'Phyla', stats.phyla, uniqueStats.phyla, otherUserStats.phyla);
    }
  }

  // Add a single comparison stat card
  addComparisonStatCard(grid, label, value, uniqueValue, otherValue) {
    const card = document.createElement('div');
    card.className = 'taxonomy-stat-card';

    const valueEl = document.createElement('div');
    valueEl.className = 'taxonomy-stat-value';
    valueEl.textContent = value.toLocaleString();

    // Add winner badge if this user has more
    if (value > otherValue) {
      const badge = document.createElement('span');
      badge.className = 'winner-badge';
      badge.textContent = 'WINNER';
      valueEl.appendChild(badge);
    }

    const labelEl = document.createElement('div');
    labelEl.className = 'taxonomy-stat-label';
    labelEl.textContent = label;

    // Add uniqueness information
    const uniqueEl = document.createElement('div');
    uniqueEl.className = 'taxonomy-stat-change';
    uniqueEl.textContent = `${uniqueValue} unique`;

    card.appendChild(valueEl);
    card.appendChild(labelEl);
    card.appendChild(uniqueEl);

    grid.appendChild(card);
  }
}

// Create singleton instance
document.addEventListener('DOMContentLoaded', function() {
  window.taxonomyStats = new TaxonomyStats();
  console.log('TaxonomyStats initialized successfully');
});

// For immediate access during script loading
window.taxonomyStats = new TaxonomyStats();