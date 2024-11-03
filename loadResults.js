// Constants for pagination
const RESULTS_PER_PAGE = 20;
let currentPage = 1;
let allResults = [];

// Function to get query parameters from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Load and display search results
async function loadSearchResults() {
  const query = getQueryParam('query');
  const filter = getQueryParam('filter');

  if (!query || !filter) {
    document.getElementById('results-container').innerHTML = "<p>No search parameters provided.</p>";
    return;
  }

  document.getElementById('results-container').innerHTML = "<p>Loading results...</p>";

  try {
    // Fetch both datasets concurrently
    const [purchaseResponse, encashmentResponse] = await Promise.all([
      fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json'),
      fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json')
    ]);

    const purchasesData = await purchaseResponse.json();
    const encashmentsData = await encashmentResponse.json();
    const purchases = purchasesData.Sheet1;
    const encashments = encashmentsData.Sheet1;

    // Determine the primary data to search based on the selected filter
    const primaryData = ['bond-no', 'reference-no', 'journal-date', 'purchase-date', 'expiry-date', 'donor', 'issue-branch', 'issue-teller'].includes(filter) ? purchases : encashments;
    const secondaryData = primaryData === purchases ? encashments : purchases;

    // Filter the primary data based on query and filter
    const primaryResults = filterData(primaryData, query, filter);

    // Enrich primary results with related information from the secondary data
    allResults = primaryResults.map(result => {
      const bondNo = result["Bond No. with Prefix"];
      const relatedData = secondaryData.find(item => item["Bond No. with Prefix"] === bondNo) || {};
      return { ...result, ...relatedData };
    });

    displayResults();
  } catch (error) {
    console.error("Error loading search results:", error);
    document.getElementById('results-container').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

// Filter data based on query and filter
function filterData(data, query, filter) {
  return data.filter(item => {
    const field = getFieldFromFilter(item, filter);
    return field && field.toString().toLowerCase().includes(query.toLowerCase());
  });
}

// Map filter to corresponding field in the JSON data
function getFieldFromFilter(item, filter) {
  const filterMapping = {
    "bond-no": "Bond No. with Prefix",
    "reference-no": "Reference No",
    "journal-date": "Journal date",
    "purchase-date": "Date of Purchase",
    "expiry-date": "Date of bond expiry",
    "donor": "Name of the Purchaser",
    "issue-branch": "Issue branch",
    "issue-teller": "Issue teller",
    "encashment-date": "Date of Encashment",
    "political-party": "Name of the Political Party",
    "pay-branch": "Pay branch",
    "pay-teller": "Pay teller"
  };
  return item[filterMapping[filter]];
}

// Function to display results with pagination
function displayResults() {
  const container = document.getElementById('results-container');
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const resultsToDisplay = allResults.slice(startIndex, endIndex);

  if (currentPage === 1) {
    container.innerHTML = `<h2>Found ${allResults.length} result(s)</h2>`;
  }

  resultsToDisplay.forEach(result => {
    container.innerHTML += `<div class="result-item">
      <p><strong>Bond No:</strong> ${result["Bond No. with Prefix"] || "N/A"}</p>
      <p><strong>Reference No (URN):</strong> ${result["Reference No"] || "N/A"}</p>
      <p><strong>Journal Date:</strong> ${result["Journal date"] || "N/A"}</p>
      <p><strong>Date of Purchase:</strong> ${result["Date of Purchase"] || "N/A"}</p>
      <p><strong>Date of Bond Expiry:</strong> ${result["Date of bond expiry"] || "N/A"}</p>
      <p><strong>Donor:</strong> ${result["Name of the Purchaser"] || "N/A"}</p>
      <p><strong>Issue Branch:</strong> ${result["Issue branch"] || "N/A"}</p>
      <p><strong>Issue Teller:</strong> ${result["Issue teller"] || "N/A"}</p>
      <p><strong>Date of Encashment:</strong> ${result["Date of Encashment"] || "N/A"}</p>
      <p><strong>Political Party:</strong> ${result["Name of the Political Party"] || "N/A"}</p>
      <p><strong>Pay Branch:</strong> ${result["Pay branch"] || "N/A"}</p>
      <p><strong>Pay Teller:</strong> ${result["Pay teller"] || "N/A"}</p>
    </div>`;
  });

  // Show "Load More" button if there are more results to load
  if (endIndex < allResults.length) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = "Load More";
    loadMoreButton.onclick = loadMoreResults;
    container.appendChild(loadMoreButton);
  }
}

// Function to load more results on button click
function loadMoreResults() {
  currentPage++;
  displayResults();
}

// Load search results when the page is loaded
loadSearchResults();
