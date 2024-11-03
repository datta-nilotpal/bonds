console.log("loadHomePage.js is running");

async function loadHomePage() {
  try {
    // Using raw GitHub URLs to fetch JSON data
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    console.log("Fetched purchases.json:", purchaseResponse);
    const purchases = await purchaseResponse.json();
    console.log("Parsed purchases data:", purchases);

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
    console.log("Fetched encashments.json:", encashmentResponse);
    const encashments = await encashmentResponse.json();
    console.log("Parsed encashments data:", encashments);

    // Summarize data for metrics
    const totalPurchases = purchases.length;
    const totalEncashments = encashments.length;

    const uniqueDonors = new Set(purchases.map(p => p["Name of the Purchaser"])).size;
    const uniqueParties = new Set(encashments.map(e => e["Name of the Political Party"])).size;

    const metricsContainer = document.getElementById('metrics-container');
    metricsContainer.innerHTML = `
      <p>Total Purchases: ${totalPurchases}</p>
      <p>Total Encashments: ${totalEncashments}</p>
      <p>Unique Donors: ${uniqueDonors}</p>
      <p>Unique Political Parties: ${uniqueParties}</p>
    `;
  } catch (error) {
    console.error("Error loading JSON data:", error);
    const metricsContainer = document.getElementById('metrics-container');
    metricsContainer.innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

loadHomePage();
