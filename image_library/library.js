let speciesData = null;
let speciesList = null;

// Function to load species data from metadata.json
async function loadSpeciesData() {
  try {
      const response = await fetch("./libraryData/metadata.json");
      speciesData = await response.json();
      const dataSorted = arrange(speciesData);
      // Extract species and store in speciesList
      speciesList = speciesData.map(item => item.species);
      renderItems(dataSorted);
  } catch (error) {
      console.error("Error loading data:", error);
  }
}

// Pass in an array of objects
function arrange(array) {

  // Returns an object of arrays -- each keyed to a letter A-Z
  let species = Object.fromEntries(
    [...new Array(26)]
      .map((_, i) => i + 65)
      .map(n => [String.fromCharCode(n), []])
    );
  /*
  Takes the given array and gets the first letter of each firstName 
  property then finds the array with that letter inside the letters 
  object and adds the current object to it's array -- once in 
  the array, it is sorted alphabetically by firstName or 
  lastName should firstName be identical
  */
  array.forEach(con => {
    let alpha = con.metadata.genus.charAt(0);
    species[alpha].push(con)
    species[alpha].sort(
      (a, b) => a.metadata.genus.localeCompare(b.metadata.genus) == 0 ? 
        a.metadata.species.localeCompare(b.metadata.species) : 
        a.metadata.genus.localeCompare(b.metadata.genus)
     )
  });
  // Filters out any letters that have empty arrays
  species = Object.fromEntries(Object.entries(species)
    .filter(sub => sub[1].length > 0)
  );
  return species;
}


// Function to render items in the container
async function renderItems(data) {
  const speciesContainer = document.getElementById("speciesContainer");
  speciesContainer.innerHTML = "";
  if (Object.keys(data).length == 0){
    const emptyBox = document.createElement("div");
    emptyBox.innerHTML = `
    <div class="empty-Box">No matching species found!</div>
    `;
    speciesContainer.appendChild(emptyBox);
  }
  Object.keys(data).forEach(letter =>{
    const letterBox = document.createElement("div")
    const letterBoxContent = `
      <div class="letter-Box" id="${letter}" style="background-color:grey; padding: 1px 0 1px 15px; font-weight: bold; font-size: 25px;">
        <p>${letter}</p>
      </div>
    `
    letterBox.innerHTML = letterBoxContent;
    speciesContainer.appendChild(letterBox);

    let group = data[letter].map(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      // Create item content
      const content = `
          <div class="species-info" style="line-height: 30px;" id="${item.species}">
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
  });
}


// Event listener for the search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value;
  
  // Create a case-insensitive regex pattern
  const regex = new RegExp(`^${searchText}`, 'i');
  
  // Filter speciesList based on searchText
  const filteredSpeciesList = speciesList.filter(species => regex.test(species));
  // Filter speciesData based on filteredSpeciesList
  const filteredSpeciesData = speciesData.filter(item => filteredSpeciesList.includes(item.species));
  const dataSorted = arrange(filteredSpeciesData);
  // Render the filtered data
  renderItems(dataSorted);
});

// Load the species data when the page loads
document.addEventListener("DOMContentLoaded", loadSpeciesData);