import { startLogin, handleCallback, getAuthHeaders } from './auth.js';

// Handle auth callback if on callback page
if (window.location.pathname === '/auth/callback') {
  handleCallback();
}

// Add login button handler
document.getElementById('inatLogin')?.addEventListener('click', startLogin);

// Force Cloudflare Worker API base
const API_BASE = window.CF_API_BASE;
if (!API_BASE) {
  console.error('CF_API_BASE is not set. Set window.CF_API_BASE to your Worker URL.');
}
const searchTaxaUrl = `${API_BASE}/search-taxa`;
const edgeFunctionUrl = `${API_BASE}/build-taxonomy`;
window.API_BASE = API_BASE;

const loadingMessages = [
  "Coaxing DNA to tell its evolutionary secrets...",
  "Unraveling the tree of life, one branch at a time...",
  "Consulting with Darwin about your taxonomy...",
  "Politely asking species to line up in order...",
  "Counting rings on the tree of life...",
  "Persuading taxonomists to agree on classifications...",
  "Gathering specimens from the digital wild...",
  "Dusting off Linnaeus' old notebooks...",
  "Herding taxonomic cats into hierarchical boxes...",
  "Calculating phylogenetic distances while sipping tea...",
  "Untangling evolutionary spaghetti...",
  "Converting genetic code to pretty pictures...",
  "Teaching old species new tricks...",
  "Searching for the missing links...",
  "Translating from Latin to Markdown...",
  "Convincing kingdoms, phyla, and classes to cooperate..."
];

const VALID_HIGHER_RANKS = new Set([
  'genus', 'family', 'subfamily', 'tribe', 'subtribe', 'order', 'suborder',
  'infraorder', 'parvorder', 'class', 'subclass', 'infraclass', 'superclass',
  'phylum', 'subphylum', 'kingdom', 'domain', 'superkingdom', 'stateofmatter'
]);

// Called when a tree is rendered
function renderMarkmap(markdown, username, taxonName, taxonId) {
  document.getElementById("markdownResult").textContent = markdown;

  // Calculate statistics before adding the tree (if taxonomyStats is available)
  let stats = null;
  try {
    if (window.taxonomyStats && typeof window.taxonomyStats.processMarkdown === 'function') {
      stats = window.taxonomyStats.processMarkdown(markdown);
      console.log(`Calculated statistics for ${username}:`, stats);
    } else {
      console.warn('TaxonomyStats module not available yet - statistics will not be calculated');
    }
  } catch (error) {
    console.error('Error calculating statistics:', error);
  }

  treeManager.addTree(username, taxonName || `Taxon ${taxonId}`, taxonId, markdown);
  showResults();
}

function showLoadingSpinner() {
  const spinnerContainer = document.getElementById("loadingSpinner");
  const loadingText = document.getElementById("loadingText");
  const resultsCard = document.getElementById("resultsCard");
  resultsCard.style.display = "none";
  spinnerContainer.style.display = "flex";
  loadingText.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  return setInterval(() => {
    loadingText.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }, 4000);
}

function hideLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

function showResults() {
  const resultsCard = document.getElementById("resultsCard");
  resultsCard.style.display = "block";
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
  hideLoadingSpinner();
  hideCompareLoadingSpinner();
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  
  // Try to find the most appropriate form to attach the error to
  const treeForm = document.getElementById("treeForm");
  const compareForm = document.getElementById("compareForm");
  const targetForm = compareForm && document.activeElement && compareForm.contains(document.activeElement) ? compareForm : treeForm;
  
  targetForm.parentNode.insertBefore(errorDiv, targetForm.nextSibling);
  setTimeout(() => { errorDiv.remove(); }, 10000);
}

// Make showError globally available
window.showError = showError;

function hideCompareLoadingSpinner() {
  const spinner = document.getElementById("compareLoadingSpinner");
  if (spinner) {
    spinner.style.display = "none";
  }
}

// Add search cache for faster results
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to search taxa - Make it globally available
async function searchTaxa(query) {
  if (!query || query.length < 2) return [];
  
  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }
  
  // Fetch from API base (Cloudflare Worker)
  try {
    const response = await fetch(`${searchTaxaUrl}?q=${encodeURIComponent(query)}&limit=10`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    const results = data.results || [];
    
    // Cache results
    searchCache.set(cacheKey, {
      results: results,
      timestamp: Date.now()
    });
    
    return results;
  } catch (error) {
    console.error("Error with search API:", error);
    return [];
  }
}

// Make searchTaxa globally available
window.searchTaxa = searchTaxa;

// Make searchTaxaUrl globally available
window.searchTaxaUrl = searchTaxaUrl;

function showAutocompleteResults(results) {
  const autocompleteContainer = document.getElementById("autocompleteResults");
  autocompleteContainer.innerHTML = "";
  if (results.length === 0) {
    autocompleteContainer.style.display = "none";
    return;
  }
  for (const result of results) {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.dataset.taxonId = result.taxon_id || result.id;
    const taxonId = result.taxon_id || result.id;
    const displayName = result.common_name || result.name;
    let displayHtml = `<strong>${displayName}</strong>`;
    if (result.common_name) {
      displayHtml += ` <span class="scientific-name">${result.name}</span>`;
    }
    displayHtml += ` <span class="taxon-id">${result.rank} (ID: ${taxonId})</span>`;
    item.innerHTML = displayHtml;
    item.addEventListener("click", () => {
      document.getElementById("taxonName").value = displayName;
      document.getElementById("selectedTaxonId").value = taxonId;
      autocompleteContainer.style.display = "none";
    });
    autocompleteContainer.appendChild(item);
  }
  autocompleteContainer.style.display = "block";
}

// Add this to script.js (ensure it's placed after the definitions of edgeFunctionUrl, etc.)
document.getElementById("treeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve form values
  const username = document.getElementById("username").value.trim();
  let taxonId, taxonName = "";

  // Check which search option is active
  if (document.getElementById("searchName").checked) {
    taxonId = document.getElementById("selectedTaxonId").value;
    taxonName = document.getElementById("taxonName").value.trim();
  } else {
    taxonId = document.getElementById("taxonId").value;
    taxonName = `Taxon ${taxonId}`;
  }

  // Show loading spinner and get an interval handle for changing messages
  const messageInterval = showLoadingSpinner();

  try {
    // Call build-taxonomy on Cloudflare API
    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        username,
        taxonId
      })
    });

    const result = await response.json();

    clearInterval(messageInterval);
    hideLoadingSpinner();

    if (result.error) {
      showError("Error: " + result.error);
      return;
    }

    const markdown = result.markdown;
    if (!markdown || markdown.trim() === "" || markdown.includes("No observations found")) {
      showError("No observations found for the user under the selected taxon.");
      return;
    }

    // Use the global treeManager instance to render the tree
    renderMarkmap(markdown, username, taxonName, taxonId);

    // Expose last build payload for Save Checkpoint
    window.__lastBuild = {
      username,
      taxonId: Number(taxonId),
      taxonName,
      speciesTaxonIds: result.speciesTaxonIds || [],
      rankCounts: result.rankCounts || {},
      highWatermarkUpdatedAt: result.highWatermarkUpdatedAt || null
    };
  } catch (err) {
    clearInterval(messageInterval);
    hideLoadingSpinner();
    showError("Error building tree: " + err.message);
  }
});


// Radio button toggle for search type
document.getElementById("searchName").addEventListener("change", function() {
  document.getElementById("nameSearch").classList.add("active");
  document.getElementById("idSearch").classList.remove("active");
});
document.getElementById("searchId").addEventListener("change", function() {
  document.getElementById("nameSearch").classList.remove("active");
  document.getElementById("idSearch").classList.add("active");
});

const taxonNameInput = document.getElementById("taxonName");
const autocompleteResults = document.getElementById("autocompleteResults");
let debounceTimeout = null;
taxonNameInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (debounceTimeout) clearTimeout(debounceTimeout);
  if (query.length < 2) {
    autocompleteResults.style.display = "none";
    return;
  }
  debounceTimeout = setTimeout(() => {
    searchTaxa(query).then(showAutocompleteResults);
  }, 150);
});