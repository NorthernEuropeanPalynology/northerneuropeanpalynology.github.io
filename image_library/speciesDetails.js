async function loadSpeciesData(speciesName) {
    try {
      const response = await fetch("../metadata.json");
      const data = await response.json();
      const speciesData = data.find(item => item.species === speciesName);
      openSpeciesDetails(speciesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

// Function to open species details window
function openSpeciesDetails(speciesData) {

    const taxaLabel = document.getElementById("taxaName");
    taxaLabel.textContent = speciesData.species;

    const imageScrollbar = document.getElementById("imageScrollbar");
    const displayedImage = document.getElementById("displayedImage");

    // Display scrollable Image container
    const imageDirectory = "./zstack/"; // Directory path where your images are stored
    speciesData.pictures.forEach((imageName, index) => {
        const imageSrc = `${imageDirectory}${imageName}`;
        const imageElement = document.createElement("span");
        imageElement.style.backgroundImage = `url(${imageSrc})`;

        imageScrollbar.appendChild(imageElement);

        // Display the middle image initially
        if (index === Math.floor(speciesData.pictures.length / 2)) {
            displayedImage.src = imageSrc;
        }
    });

    imageScrollbar.addEventListener("click", function() {
      displayedImage.src = imageSrc;
    });

    // Display additional metadata
    const infoContainer = document.getElementById("infoContainer");
    const metadata = speciesData.metadata;
    metadata.forEach((item) => {
      const metadataItem = document.createElement("p");
      metadataItem.textContent = `${item.label}: ${item.value}`;
      infoContainer.appendChild(metadataItem);
    });

    
}
