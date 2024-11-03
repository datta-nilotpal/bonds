console.log("loadHomePage.js is running");

async function loadHomePage() {
  try {
    // Fetch data from raw GitHub URLs
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    // Basic Key Metrics
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

    // Top Donors by Party
    const topDonorsByParty = getTopDonorsByParty(encashments);
    displayTopDonorsByParty(topDonorsByParty);

    // Timeline Analysis for Purchases and Encashments
    const timelineData = getTimelineData(purchases, encashments);
    displayTimelineData(timelineData);

    // High-Denomination Bonds
    const highDenominationThreshold = 10000000; // Adjust threshold as needed (e.g., ₹1 crore)
    const highDenominationBonds = purchases.filter(p => p["Denominations"] >= highDenominationThreshold);
    displayHighDenominationBonds(highDenominationBonds);

  } catch (error) {
    console.error("Error loading JSON data:", error);
    const metricsContainer = document.getElementById('metrics-container');
    metricsContainer.innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

loadHomePage();

// Functions for Enhanced Analysis

// 1. Top Donors by Party
function getTopDonorsByParty(encashments) {
  const donorsByParty = {};

  encashments.forEach(encashment => {
    const party = encashment["Name of the Political Party"];
    const donor = encashment["Name of the Purchaser"];
    const amount = encashment["Denominations"];

    if (!donorsByParty[party]) {
      donorsByParty[party] = {};
    }

    if (!donorsByParty[party][donor]) {
      donorsByParty[party][donor] = 0;
    }

    donorsByParty[party][donor] += amount;
  });

  // Sort donors by contribution amount and get top 5 donors for each party
  for (const party in donorsByParty) {
    donorsByParty[party] = Object.entries(donorsByParty[party])
      .sort((a, b) => b[1] - a[1]) // Sort by amount, descending
      .slice(0, 5); // Top 5 donors
  }

  return donorsByParty;
}

function displayTopDonorsByParty(topDonorsByParty) {
  const container = document.getElementById('top-donors-by-party');
  container.innerHTML = "<h2>Top Donors by Political Party</h2>";
  
  for (const [party, donors] of Object.entries(topDonorsByParty)) {
    const partyDiv = document.createElement('div');
    partyDiv.innerHTML = `<h3>${party}</h3>`;
    donors.forEach(([donor, amount]) => {
      partyDiv.innerHTML += `<p>Donor: ${donor}, Amount: ₹${amount.toLocaleString()}</p>`;
    });
    container.appendChild(partyDiv);
  }
}

// 2. Timeline Analysis
function getTimelineData(purchases, encashments) {
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

  return { purchaseTimeline, encashmentTimeline };
}

function displayTimelineData(timelineData) {
  const { purchaseTimeline, encashmentTimeline } = timelineData;
  const container = document.getElementById('timeline-data');
  container.innerHTML = "<h2>Transaction Timeline Analysis</h2>";

  for (const date in purchaseTimeline) {
    container.innerHTML += `<p>Purchase Date: ${date}, Total Amount: ₹${purchaseTimeline[date].toLocaleString()}</p>`;
  }
  
  for (const date in encashmentTimeline) {
    container.innerHTML += `<p>Encashment Date: ${date}, Total Amount: ₹${encashmentTimeline[date].toLocaleString()}</p>`;
  }
}

// 3. High-Denomination Bonds
function displayHighDenominationBonds(highDenominationBonds) {
  const container = document.getElementById('high-denomination-bonds');
  container.innerHTML = "<h2>High-Denomination Bonds (₹1 Crore or more)</h2>";
  
  highDenominationBonds.forEach(bond => {
    container.innerHTML += `<p>Donor: ${bond["Name of the Purchaser"]}, Amount: ₹${bond["Denominations"].toLocaleString()}, Date: ${bond["Date of\r\nPurchase"]}</p>`;
  });
}
