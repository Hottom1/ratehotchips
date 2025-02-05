// Load existing ratings from localStorage
let ratings = JSON.parse(localStorage.getItem('hotChipRatings')) || [];

// Function to calculate overall score
function calculateOverall(crispiness, flavor, texture, temperature, appearance) {
  return ((crispiness + flavor + texture + temperature + appearance) / 5).toFixed(1);
}

// Function to render ratings table
function renderRatings() {
  const tbody = document.querySelector('#ratingsTable tbody');
  tbody.innerHTML = ratings
    .map(
      (rating) => `
      <tr>
        <td>${rating.brand}</td>
        <td>${rating.crispiness}</td>
        <td>${rating.flavor}</td>
        <td>${rating.texture}</td>
        <td>${rating.temperature}</td>
        <td>${rating.appearance}</td>
        <td>${rating.overall}</td>
      </tr>
    `
    )
    .join('');
}

// Function to sort ratings
function sortRatings(criteria) {
  ratings.sort((a, b) => b[criteria] - a[criteria]);
  renderRatings();
}

// Handle form submission
document.getElementById('ratingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const brand = document.getElementById('brand').value;
  const crispiness = parseInt(document.getElementById('crispiness').value);
  const flavor = parseInt(document.getElementById('flavor').value);
  const texture = parseInt(document.getElementById('texture').value);
  const temperature = parseInt(document.getElementById('temperature').value);
  const appearance = parseInt(document.getElementById('appearance').value);

  // Calculate overall score
  const overall = calculateOverall(crispiness, flavor, texture, temperature, appearance);

  // Add new rating to the list
  ratings.push({
    brand,
    crispiness,
    flavor,
    texture,
    temperature,
    appearance,
    overall,
  });

  // Save to localStorage
  localStorage.setItem('hotChipRatings', JSON.stringify(ratings));

  // Render updated ratings table
  renderRatings();

  // Reset form
  document.getElementById('ratingForm').reset();
});

// Handle sort by selection
document.getElementById('sortBy').addEventListener('change', (e) => {
  sortRatings(e.target.value);
});

// Export ratings as CSV file
document.getElementById('exportButton').addEventListener('click', () => {
  const headers = ["Brand/Restaurant", "Crispiness", "Flavor", "Texture", "Temperature", "Appearance", "Overall"];
  const csvContent =
    headers.join(",") +
    "\n" +
    ratings
      .map((rating) =>
        [
          `"${rating.brand}"`,
          rating.crispiness,
          rating.flavor,
          rating.texture,
          rating.temperature,
          rating.appearance,
          rating.overall,
        ].join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hot-chip-ratings.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Import ratings from JSON file
document.getElementById('importButton').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedRatings = JSON.parse(event.target.result);
        if (Array.isArray(importedRatings)) {
          ratings = importedRatings;
          localStorage.setItem('hotChipRatings', JSON.stringify(ratings));
          renderRatings();
          alert("Ratings imported successfully!");
        } else {
          alert("Invalid JSON file. Please ensure the file contains an array of ratings.");
        }
      } catch (error) {
        alert("Error parsing JSON file. Please ensure the file is valid.");
      }
    };
    reader.readAsText(file);
  }
});

// Initial render
renderRatings();