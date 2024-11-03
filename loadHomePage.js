console.log("loadHomePage.js is running");

// Async functions for each section to break up loading tasks
async function loadKeyMetrics() {
  try {
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
  } catch (error) {
    console.error("Error loading key metrics:", error);
    document.getElementById('metrics-container').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

async function loadTopDonorsByParty() {
  try {
    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    const topDonorsByParty = getTopDonorsByParty(encashments);
    displayTopDonorsByParty(topDonorsByParty);
  } catch (error) {
    console.error("Error loading top donors by party:", error);
    document.getElementById('top-donors-by-party').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

async function loadTimelineData() {
  try {
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const encashmentResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/encashments.json');
    const encashmentsData = await encashmentResponse.json();
    const encashments = encashmentsData.Sheet1;

    const timelineData = getTimelineData(purchases, encashments);
    displayTimelineData(timelineData);
  } catch (error) {
    console.error("Error loading timeline data:", error);
    document.getElementById('timeline-data').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

async function loadHighDenominationBonds() {
  try {
    const purchaseResponse = await fetch('https://raw.githubusercontent.com/datta-nilotpal/bonds/refs/heads/main/data/purchases.json');
    const purchasesData = await purchaseResponse.json();
    const purchases = purchasesData.Sheet1;

    const highDenominationThreshold = 10000000; // Set threshold as needed
    const highDenominationBonds = purchases.filter(p => p["Denominations"] >= highDenominationThreshold);
    displayHighDenominationBonds(highDenominationBonds);
  } catch (error) {
    console.error("Error loading high denomination bonds:", error);
    document.getElementById('high-denomination-bonds').innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

// Call async functions independently to load data in smaller tasks
loadKeyMetrics();
loadTopDonorsByParty();
loadTimelineData();
loadHighDenominationBonds();

// Helper Functions

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

  // Get top 5 donors for each party
  for (const party in donorsByParty) {
    donorsByParty[party] = Object.entries(donorsByParty[party])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
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

function displayHighDenominationBonds(highDenominationBonds) {
  const container = document.getElementById('high-denomination-bonds');
  container.innerHTML = "<h2>High-Denomination Bonds (₹1 Crore or more)</h2>";
  highDenominationBonds.forEach(bond => {
    container.innerHTML += `<p>Donor: ${bond["Name of the Purchaser"]}, Amount: ₹${bond["Denominations"].toLocaleString()}, Date: ${bond["Date of\r\nPurchase"]}</p>`;
  });
}
