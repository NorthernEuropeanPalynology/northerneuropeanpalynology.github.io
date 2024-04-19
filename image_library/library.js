// Function to load species data from metadata.json
async function loadSpeciesData() {
    try {
      const response = await fetch("libraryData/metadata.json");
      const data = await response.json();
      renderItems(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }
  
  // Function to render items in the container
  function renderItems(data) {
    const speciesContainer = document.getElementById("speciesContainer");
    speciesContainer.innerHTML = "";
    data.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
  
      // Create item content
      const content = `
        <div class="species-name-container">
          <span class="species-name">${item.species}</span>
        </div>
        <div>${item.origin}</div>
        <div>${item.university}</div>
        <img src="libraryData/${item.species}/preview.jpg" alt="${item.species}">
      `;
      itemDiv.innerHTML = content;
      speciesContainer.appendChild(itemDiv);
  
      // Attach click event listener to species name
      const speciesNameElement = itemDiv.querySelector(".species-name");
      speciesNameElement.addEventListener("click", function () {
        const path = `./libraryData/${item.species}/species.html`;
        window.location.href = path;
      });
    });
  }

  
  // Initial load of data
  loadSpeciesData();
  
  // Search functionality remains unchanged
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();
    // Implement search logic if needed
  });