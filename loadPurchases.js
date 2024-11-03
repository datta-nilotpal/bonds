async function loadPurchases() {
  const response = await fetch('./data/purchases.json');
  const purchases = await response.json();
  
  const container = document.getElementById('purchases-container');
  container.innerHTML = purchases.map(purchase => `
    <p>
      <a href="purchase-detail.html?id=${purchase['Purchase ID']}">
        Purchase ID: ${purchase['Purchase ID']}, Buyer: ${purchase['Name of the Purchaser']}, Amount: ${purchase['Denominations']}
      </a>
    </p>
  `).join('');
}

loadPurchases();
