async function loadEncashments() {
  const response = await fetch('./data/encashments.json');
  const encashments = await response.json();
  
  const container = document.getElementById('encashments-container');
  container.innerHTML = encashments.map(encashment => `
    <p>
      <a href="encashment-detail.html?id=${encashment['Encashment ID']}">
        Encashment ID: ${encashment['Encashment ID']}, Party: ${encashment['Political Party']}, Amount: ${encashment['Denominations']}
      </a>
    </p>
  `).join('');
}

loadEncashments();
