console.log("loadHomePage.js is running");

async function loadKeyMetrics() {
  try {
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
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

    // Load additional insights one by one
    loadTopDonorsByParty(encashments);
    loadTimelineData(purchases, encashments);
    loadHighDenominationBonds(purchases);

  } catch (error) {
    console.error("Error loading key metrics:", error);
    document.getElementById('metrics-container').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

// Load Top Donors by Party
function loadTopDonorsByParty(encashments) {
  try {
    const topDonorsByParty = {};
    encashments.forEach(encashment => {
      const party = encashment["Name of the Political Party"];
      const donor = encashment["Name of the Purchaser"];
      const amount = encashment["Denominations"];

      if (!topDonorsByParty[party]) topDonorsByParty[party] = {};
      if (!topDonorsByParty[party][donor]) topDonorsByParty[party][donor] = 0;

      topDonorsByParty[party][donor] += amount;
    });

    const container = document.getElementById('top-donors-by-party');
    container.innerHTML = "<h2>Top Donors by Political Party</h2>";

    for (const [party, donors] of Object.entries(topDonorsByParty)) {
      const sortedDonors = Object.entries(donors).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const partyDiv = document.createElement('div');
      partyDiv.innerHTML = `<h3>${party}</h3>`;
      sortedDonors.forEach(([donor, amount]) => {
        partyDiv.innerHTML += `<p>Donor: ${donor}, Amount: ₹${amount.toLocaleString()}</p>`;
      });
      container.appendChild(partyDiv);
    }
    console.log("Top Donors by Party loaded successfully.");
  } catch (error) {
    console.error("Error loading top donors by party:", error);
  }
}

// Load Transaction Timeline Data
function loadTimelineData(purchases, encashments) {
  try {
    const purchaseTimeline = {};
    const encashmentTimeline = {};

    purchases.forEach(purchase => {
      const date = purchase["Date of\r\nPurchase"];
      purchaseTimeline[date] = (purchaseTimeline[date] || 0) + purchase["Denominations"];
    });

    encashments.forEach(encashment => {
      const date = encashment["Date of\r\nEncashment"];
      encashmentTimeline[date] = (encashmentTimeline[date] || 0) + encashment["Denominations"];
    });

    const container = document.getElementById('timeline-data');
    container.innerHTML = "<h2>Transaction Timeline Analysis</h2>";
    for (const date in purchaseTimeline) {
      container.innerHTML += `<p>Purchase Date: ${date}, Total Amount: ₹${purchaseTimeline[date].toLocaleString()}</p>`;
    }
    for (const date in encashmentTimeline) {
      container.innerHTML += `<p>Encashment Date: ${date}, Total Amount: ₹${encashmentTimeline[date].toLocaleString()}</p>`;
    }
    console.log("Timeline data loaded successfully.");
  } catch (error) {
    console.error("Error loading timeline data:", error);
  }
}

// Load High-Denomination Bonds
function loadHighDenominationBonds(purchases) {
  try {
    const highDenominationThreshold = 10000000;
    const highDenominationBonds = purchases.filter(p => p["Denominations"] >= highDenominationThreshold);

    const container = document.getElementById('high-denomination-bonds');
    container.innerHTML = "<h2>High-Denomination Bonds (₹1 Crore or more)</h2>";
    highDenominationBonds.forEach(bond => {
      container.innerHTML += `<p>Donor: ${bond["Name of the Purchaser"]}, Amount: ₹${bond["Denominations"].toLocaleString()}, Date: ${bond["Date of\r\nPurchase"]}</p>`;
    });
    console.log("High-Denomination Bonds loaded successfully.");
  } catch (error) {
    console.error("Error loading high denomination bonds:", error);
  }
}

// Load Key Metrics initially
loadKeyMetrics();
