async function loadBondNumbers() {
  const responsePurchases = await fetch('./data/purchases.json');
  const purchases = await responsePurchases.json();

  const responseEncashments = await fetch('./data/encashments.json');
  const encashments = await responseEncashments.json();

  // Collect unique bond numbers from both purchases and encashments
  const bondNumbers = new Set([
    ...purchases.map(p => p['Prefix + Bond Number']),
    ...encashments.map(e => e['Prefix + Bond Number'])
  ]);

  // Display bond numbers as links
  const container = document.getElementById('bond-numbers-container');
  container.innerHTML = Array.from(bondNumbers).map(bondNumber => `
    <p>
      <a href="bond-detail.html?bond=${encodeURIComponent(bondNumber)}">${bondNumber}</a>
    </p>
  `).join('');
}

loadBondNumbers();
