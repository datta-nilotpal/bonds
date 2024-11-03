async function loadResults() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query").toLowerCase();
    const filter = urlParams.get("filter");

    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    let results = [];

    if (filter === "bond_number") {
      results = purchases.filter(item => item["Prefix + Bond Number"].toLowerCase() === query)
        .concat(encashments.filter(item => item["Prefix + Bond Number"].toLowerCase() === query));
    } else if (filter === "reference_no") {
      results = purchases.filter(item => item["Reference No  (URN)"].toLowerCase() === query);
    } else if (filter === "donor") {
      results = purchases.filter(item => item["Name of the Purchaser"].toLowerCase().includes(query));
    } else if (filter === "political_party") {
      results = encashments.filter(item => item["Name of the Political Party"].toLowerCase().includes(query));
    }

    if (results.length === 0) {
      document.getElementById("results-container").innerHTML = "<p>No results found.</p>";
      return;
    }

    document.getElementById("results-container").innerHTML = `
      <h2>Showing ${results.length} Results</h2>
      ${results.slice(0, 50).map(result => `<p>${JSON.stringify(result)}</p>`).join('')}
    `;

    console.log("Search results loaded successfully.");
  } catch (error) {
    console.error("Error loading search results:", error);
    document.getElementById("results-container").innerHTML = `<p>Error loading search results. Please try again later.</p>`;
  }
}

loadResults();
