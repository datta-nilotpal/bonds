console.log("loadHomePage.js is running");

async function loadKeyMetrics() {
  try {
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    const totalPurchases = purchases.length;
    const totalEncashments = encashments.length;
    const uniqueDonors = new Set(purchases.map(p => p["Name of the Purchaser"])).size;
    const uniqueParties = new Set(encashments.map(e => e["Name of the Political Party"])).size;

    document.getElementById('metrics-container').innerHTML = `
      <p>Total Purchases: ${totalPurchases}</p>
      <p>Total Encashments: ${totalEncashments}</p>
      <p>Unique Donors: ${uniqueDonors}</p>
      <p>Unique Political Parties: ${uniqueParties}</p>
    `;
    console.log("Key Metrics loaded successfully.");
  } catch (error) {
    console.error("Error loading key metrics:", error);
    document.getElementById('metrics-container').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

// Redirect with search parameters
function redirectToResults() {
  const searchQuery = document.getElementById("search-bar").value;
  const filterType = document.querySelector('input[name="filter-type"]:checked').value;
  window.location.href = `results.html?query=${encodeURIComponent(searchQuery)}&filter=${filterType}`;
}

loadKeyMetrics();
