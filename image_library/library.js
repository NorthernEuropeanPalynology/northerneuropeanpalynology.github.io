// Function to load species data from metadata.json
async function loadSpeciesData() {
  try {
      const response = await fetch("./libraryData/metadata.json");
      const data = await response.json();
      renderItems(data);
  } catch (error) {
      console.error("Error loading data:", error);
  }
}

// Function to render items in the container
async function renderItems(data) {
  const speciesContainer = document.getElementById("speciesContainer");
  speciesContainer.innerHTML = "";
  data.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      // Create item content
      const content = `
          <div class="species-info" style="line-height: 30px;">
              <b class="species-name" style="font-style: italic; font-size: 20px;">${item.species}</b>
              <br>
              <span class="family">${item.metadata.family}</span>
              <br>
              <span class="pollen-type">${item.metadata.pollenType}</span>
              <br>
              <span class="collaborator">${item.metadata.collaborator}</span>
              <br>
              <span class="collaborator">${item.metadata.origin}, ${item.metadata.date}</span>
          </div>

          <div class="imageBox" id="imageBox-${item.species}"></div>

          <div class="measurements" style="line-height: 30px;">
              <b class="majorAxis">Major Axis: ${item.metadata.majorAxis[0]}µm</b>
              <br>
              <span class="majorAxisRange">95% range: &plusmn; ${item.metadata.majorAxis[1]}µm</span>
              <br>
              <b class="minorAxis">Minor Axis: ${item.metadata.minorAxis[0]}µm</b>
              <br>
              <span class="minorAxisRange">95% range: &plusmn; ${item.metadata.minorAxis[1]}µm</span>
              <br>
              <b class="numberImages">Number of images: ${item.metadata.numberOfImages}</b>
          </div>
      `;
      itemDiv.innerHTML = content;
      itemDiv.style = "padding: 5px 20px 5px 20px;";
      speciesContainer.appendChild(itemDiv);

      // Dynamically add preview images
      const imageBox = document.getElementById(`imageBox-${item.species}`);
      console.log(item.metadata.previewImages);
      item.metadata.previewImages.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = `./libraryData/${item.species}/previews/${image}`;
        imgElement.alt = item.species;
        imageBox.appendChild(imgElement);
      });

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
