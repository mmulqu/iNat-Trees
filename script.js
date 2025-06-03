import { startLogin, handleCallback, getAuthHeaders } from './auth.js';

// Handle auth callback if on callback page
if (window.location.pathname === '/auth/callback') {
  handleCallback();
}

// Add login button handler
document.getElementById('inatLogin')?.addEventListener('click', startLogin);

// Add auth headers to existing requests
const edgeFunctionUrl = "https://niuoetejipudtisdizbn.supabase.co/functions/v1/build-taxonomy";
const searchTaxaUrl = "https://niuoetejipudtisdizbn.supabase.co/functions/v1/search-taxa";

// Create Supabase client
const supabaseUrl = "https://niuoetejipudtisdizbn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdW9ldGVqaXB1ZHRpc2RpemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjIxMTEsImV4cCI6MjA1NTk5ODExMX0.kD2fzJk_cNPQLXahWF8BLuodZkz8Dxfy2m9sSEVhsvg";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseKey = supabaseKey;

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
  const errorDiv = document.createElement("div");
  errorDiv.className = "alert alert-danger mt-3";
  errorDiv.textContent = message;
  const form = document.getElementById("treeForm");
  form.parentNode.insertBefore(errorDiv, form.nextSibling);
  setTimeout(() => { errorDiv.remove(); }, 10000);
}

// Function to search taxa - Make it globally available
async function searchTaxa(query) {
  if (!query || query.length < 2) return [];
  try {
    // First try local search
    let { data: commonNameResults, error: commonNameError } = await supabase
      .from('taxa')
      .select('taxon_id, name, rank, common_name')
      .ilike('common_name', `%${query}%`)
      .limit(10);
    if (commonNameError) throw commonNameError;
    let { data: scientificNameResults, error: scientificNameError } = await supabase
      .from('taxa')
      .select('taxon_id, name, rank, common_name')
      .ilike('name', `%${query}%`)
      .limit(10);
    if (scientificNameError) throw scientificNameError;
    const allResults = [...(commonNameResults || [])];
    if (scientificNameResults) {
      for (const result of scientificNameResults) {
        if (!allResults.some(r => r.taxon_id === result.taxon_id)) {
          allResults.push(result);
        }
      }
    }
    const filteredResults = allResults.filter(taxon =>
      taxon.rank && VALID_HIGHER_RANKS.has(taxon.rank.toLowerCase())
    );
    if (filteredResults.length >= 3) {
      const rankOrder = {
        'kingdom': 10, 'phylum': 9, 'class': 8, 'order': 7, 'family': 6, 'genus': 5
      };
      filteredResults.sort((a, b) => {
        const aExactCommon = a.common_name && a.common_name.toLowerCase() === query.toLowerCase();
        const bExactCommon = b.common_name && b.common_name.toLowerCase() === query.toLowerCase();
        const aExactName = a.name.toLowerCase() === query.toLowerCase();
        const bExactName = b.name.toLowerCase() === query.toLowerCase();
        if (aExactCommon && !bExactCommon) return -1;
        if (!aExactCommon && bExactCommon) return 1;
        if (aExactName && !bExactName) return -1;
        if (!aExactName && bExactName) return 1;
        const aRankValue = rankOrder[a.rank.toLowerCase()] || 0;
        const bRankValue = rankOrder[b.rank.toLowerCase()] || 0;
        return bRankValue - aRankValue;
      });
      return filteredResults.slice(0, 10);
    }
    console.log("Not enough local results, trying edge function search");
  } catch (error) {
    console.error("Error with local DB search:", error);
  }
  try {
    const response = await fetch(`${searchTaxaUrl}?q=${encodeURIComponent(query)}&limit=10`, {
      headers: { 
        "Authorization": `Bearer ${supabaseKey}`,
        ...getAuthHeaders()
      }
    });
    if (!response.ok) {
      throw new Error(`Edge function error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error("Error with edge function search:", error);
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

// Add this to script.js (ensure it's placed after the definitions of edgeFunctionUrl, supabaseKey, etc.)
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
    // Use the build-taxonomy endpoint here instead of compare-taxa-function
    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
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
  }, 300);
});