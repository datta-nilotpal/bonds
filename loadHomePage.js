async function loadHomePage() {
  const purchaseResponse = await fetch('./data/purchases.json');
  const purchases = await purchaseResponse.json();

  const encashmentResponse = await fetch('./data/encashments.json');
  const encashments = await encashmentResponse.json();

  const totalPurchases = purchases.length;
  const totalEncashments = encashments.length;

  const uniqueDonors = new Set(purchases.map(p => p['Name of the Purchaser'])).size;
  const uniqueParties = new Set(encashments.map(e => e['Political Party'])).size;

  const metricsContainer = document.getElementById('metrics-container');
  metricsContainer.innerHTML = `
    <p>Total Purchases: ${totalPurchases}</p>
    <p>Total Encashments: ${totalEncashments}</p>
    <p>Unique Donors: ${uniqueDonors}</p>
    <p>Unique Political Parties: ${uniqueParties}</p>
  `;
}

loadHomePage();
