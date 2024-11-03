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

  try {
    // Fetch data from JSON files
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    // Choose the dataset based on the filter type
    let results = [];
    if (['bond-no', 'reference-no', 'journal-date', 'purchase-date', 'expiry-date', 'donor', 'issue-branch', 'issue-teller'].includes(filter)) {
      results = filterData(purchases, query, filter);
    } else if (['encashment-date', 'political-party', 'pay-branch', 'pay-teller'].includes(filter)) {
      results = filterData(encashments, query, filter);
    }

    // Display results in the results container
    const container = document.getElementById('results-container');
    if (results.length > 0) {
      container.innerHTML = `<h2>Found ${results.length} result(s) for "${query}" in "${filter}"</h2>`;
      results.forEach(result => {
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
    } else {
      container.innerHTML = `<p>No results found for "${query}" in "${filter}".</p>`;
    }
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

// Load search results when the page is loaded
loadSearchResults();
