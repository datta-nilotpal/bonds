console.log("loadHomePage.js is running");

function redirectToResults() {
  const searchQuery = document.getElementById("search-bar").value;
  const filterType = document.getElementById("filter-type").value;
  window.location.href = `results.html?query=${encodeURIComponent(searchQuery)}&filter=${filterType}`;
}
