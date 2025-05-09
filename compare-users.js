// compare-users.js
// (Note: TreeManager is defined only in tree-manager.js.)

function showCompareLoadingSpinner() {
  const spinnerContainer = document.getElementById("compareLoadingSpinner");
  const loadingText = document.getElementById("compareLoadingText");
  const resultsCard = document.getElementById("resultsCard");
  resultsCard.style.display = "none";
  spinnerContainer.style.display = "flex";
  const battleMessages = [
    "Initializing the taxonomic battlefield...",
    "Pitting naturalists against each other...",
    "Measuring biodiversity prowess...",
    "Calculating phylogenetic victories...",
    "Comparing observation territories...",
    "Tallying species counts...",
    "Mapping taxonomic conquests...",
    "Determining the phylogenetic champion...",
    "Evaluating naturalist rivalry...",
    "Loading the observation arena...",
    "Processing competitive biodiversity...",
    "Nature nerds battling it out...",
    "Letting the species decide the winner...",
    "Observations at dawn: 10 paces...",
    "Analyzing who's the better taxonomist..."
  ];
  document.getElementById("compareLoadingText").textContent =
    battleMessages[Math.floor(Math.random() * battleMessages.length)];
  return setInterval(() => {
    document.getElementById("compareLoadingText").textContent =
      battleMessages[Math.floor(Math.random() * battleMessages.length)];
  }, 4000);
}

function hideCompareLoadingSpinner() {
  document.getElementById("compareLoadingSpinner").style.display = "none";
}

const compareUsersUrl = "https://niuoetejipudtisdizbn.supabase.co/functions/v1/compare-taxa-function";

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("compareSearchName").addEventListener("change", function() {
    document.getElementById("compareNameSearch").classList.add("active");
    document.getElementById("compareIdSearch").classList.remove("active");
  });

  document.getElementById("compareSearchId").addEventListener("change", function() {
    document.getElementById("compareNameSearch").classList.remove("active");
    document.getElementById("compareIdSearch").classList.add("active");
  });

  const compareTaxonNameInput = document.getElementById("compareTaxonName");
  const compareAutocompleteResults = document.getElementById("compareAutocompleteResults");
  let compareDebounceTimeout = null;
  compareTaxonNameInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    document.getElementById("compareSelectedTaxonId").value = "";
    if (compareDebounceTimeout) clearTimeout(compareDebounceTimeout);
    if (query.length < 2) {
      compareAutocompleteResults.style.display = "none";
      return;
    }
    compareDebounceTimeout = setTimeout(async () => {
      const results = await searchTaxa(query);
      showCompareAutocompleteResults(results);
    }, 300);
  });

  function showCompareAutocompleteResults(results) {
    const autocompleteContainer = document.getElementById("compareAutocompleteResults");
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
        document.getElementById("compareTaxonName").value = displayName;
        document.getElementById("compareSelectedTaxonId").value = taxonId;
        autocompleteContainer.style.display = "none";
      });
      autocompleteContainer.appendChild(item);
    }
    autocompleteContainer.style.display = "block";
  }

  document.addEventListener("click", (e) => {
    if (!compareTaxonNameInput.contains(e.target) && !compareAutocompleteResults.contains(e.target)) {
      compareAutocompleteResults.style.display = "none";
    }
  });

  const compareForm = document.getElementById("compareForm");
  if (compareForm) {
    compareForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const existingErrors = document.querySelectorAll(".alert-danger");
      existingErrors.forEach(error => error.remove());
      const username1 = document.getElementById("username1").value.trim();
      const username2 = document.getElementById("username2").value.trim();
      let taxonId;
      let taxonName = "";
      if (!username1 || !username2) {
        showError("Both usernames are required.");
        return;
      }
      const isNameSearch = document.getElementById("compareSearchName").checked;
      if (isNameSearch) {
        taxonId = document.getElementById("compareSelectedTaxonId").value;
        taxonName = document.getElementById("compareTaxonName").value.trim();
        if (!taxonId) {
          if (!taxonName) {
            showError("Please enter a taxon name or select one from the suggestions.");
            return;
          }
          const messageInterval = showCompareLoadingSpinner();
          try {
            const results = await searchTaxa(taxonName);
            if (results.length === 0) {
              clearInterval(messageInterval);
              hideCompareLoadingSpinner();
              showError(`No matching taxa found for "${taxonName}". Please try a different name or use the suggestions.`);
              return;
            }
            taxonId = results[0].taxon_id || results[0].id;
            console.log(`Using taxon ID ${taxonId} (${results[0].name}) for comparison`);
          } catch (err) {
            clearInterval(messageInterval);
            hideCompareLoadingSpinner();
            showError("Error searching for taxon: " + err.message);
            return;
          }
        }
      } else {
        taxonId = parseInt(document.getElementById("compareTaxonId").value);
        taxonName = `Taxon ${taxonId}`;
        if (!taxonId) {
          showError("Please enter a valid taxon ID.");
          return;
        }
      }
      const messageInterval = showCompareLoadingSpinner();
      try {
        const response = await fetch(compareUsersUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ 
            username1, 
            username2, 
            taxonId 
          })
        });
        const result = await response.json();
        clearInterval(messageInterval);
        hideCompareLoadingSpinner();
        if (result.error) {
          showError("Error: " + result.error);
          return;
        }
        const markdown = result.markdown;
        if (!markdown || markdown.trim() === "" || markdown.includes("No observations found")) {
          showError("No observations found for at least one of the users under the selected taxon.");
          return;
        }
        renderComparison(markdown, username1, username2, taxonName, taxonId);
      } catch (err) {
        clearInterval(messageInterval);
        hideCompareLoadingSpinner();
        showError("Error comparing users: " + err.message);
      }
    });
  }
});

// Update the rendering function for comparison in compare-users.js
function renderComparison(markdown, username1, username2, taxonName, taxonId) {
  document.getElementById("markdownResult").textContent = markdown;

  // Calculate statistics before adding the tree
  let stats = null;
  try {
    if (window.taxonomyStats && typeof window.taxonomyStats.processComparisonMarkdown === 'function') {
      stats = window.taxonomyStats.processComparisonMarkdown(markdown);
    }
  } catch (error) {
    console.error('Error calculating comparison statistics:', error);
  }

  // Add the tree
  const treeId = window.treeManager.addComparisonTree(username1, username2, taxonName, taxonId, markdown, stats);
  showResults();

  // Start the battle animation - ADD THIS LINE
  console.log("Starting battle animation for", username1, "vs", username2, "with treeId", treeId);
  if (window.battleAnimator && typeof window.battleAnimator.startBattleCountdown === 'function') {
    window.battleAnimator.startBattleCountdown(username1, username2, function() {
      console.log("Animation complete, now animating tree", treeId);
      window.battleAnimator.animateTree(treeId);
    });
  } else {
    console.error("Battle animator not available:", window.battleAnimator);
  }
}
