async function loadDateDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateType = urlParams.get('type');

  // Define the field name based on the date type
  let dateField = '';
  switch (dateType) {
    case 'purchase':
      dateField = 'Date of\\r\\nPurchase';
      break;
    case 'encashment':
      dateField = 'Date of Encashment';
      break;
    case 'expiry':
      dateField = 'Date of Expiry';
      break;
    case 'journal':
      dateField = 'Journal Date';
      break;
    default:
      dateField = '';
  }

  // Set the page title based on the date type
  const pageTitle = dateType.charAt(0).toUpperCase() + dateType.slice(1) + ' Date';
  document.getElementById('date-title').innerText = `Transactions by ${pageTitle}`;

  const purchaseResponse = await fetch('./data/purchases.json');
  const purchases = await purchaseResponse.json();

  const encashmentResponse = await fetch('./data/encashments.json');
  const encashments = await encashmentResponse.json();

  // Filter transactions by the specified date type
  const datePurchases = purchases.filter(p => p[dateField]);
  const dateEncashments = encashments.filter(e => e[dateField]);

  const container = document.getElementById('date-detail-container');
  container.innerHTML = `
    <h2>Transactions on ${pageTitle}</h2>
    <h3>Purchases</h3>
    ${datePurchases.length > 0 ? datePurchases.map(purchase => `
      <p>Donor: ${purchase['Name of the Purchaser']}, Amount: ${purchase['Denominations']}, ${pageTitle}: ${purchase[dateField]}</p>
    `).join('') : '<p>No purchases found for this date type.</p>'}
    
    <h3>Encashments</h3>
    ${dateEncashments.length > 0 ? dateEncashments.map(encashment => `
      <p>Political Party: ${encashment['Political Party']}, Amount: ${encashment['Denominations']}, ${pageTitle}: ${encashment[dateField]}</p>
    `).join('') : '<p>No encashments found for this date type.</p>'}
  `;
}

loadDateDetail();
