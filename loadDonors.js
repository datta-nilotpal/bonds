async function loadDonors() {
  const response = await fetch('./data/purchases.json');
  const purchases = await response.json();
  
  const donors = [...new Set(purchases.map(p => p['Name of the Purchaser']))];
  const container = document.getElementById('donors-container');
  container.innerHTML = donors.map(donor => `
    <p>
      <a href="donor-transactions.html?donor=${encodeURIComponent(donor)}">${donor}</a>
    </p>
  `).join('');
}

loadDonors();
