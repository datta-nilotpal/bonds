async function loadParties() {
  const response = await fetch('./data/encashments.json');
  const encashments = await response.json();
  
  const parties = [...new Set(encashments.map(e => e['Political Party']))];
  const container = document.getElementById('parties-container');
  container.innerHTML = parties.map(party => `
    <p>
      <a href="party-transactions.html?party=${encodeURIComponent(party)}">${party}</a>
    </p>
  `).join('');
}

loadParties();
