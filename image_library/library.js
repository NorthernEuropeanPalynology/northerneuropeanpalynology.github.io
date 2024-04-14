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
  
  function handleSpeciesClick(species, images, metadata){
    let newWindow = open('/', 'example', 'width=300,height=300')
    newWindow.focus();

    alert(newWindow.location.href); // (*) about:blank, loading hasn't started yet

    newWindow.onload = function() {
      let html = `<div style="font-size:30px">Welcome!</div>`;
      newWindow.document.body.insertAdjacentHTML('afterbegin', html);
    };
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
        handleSpeciesClick(item.species, getZStackImages(item.species), item.metadata);
      });
    });
  }
  
  // Function to get z-stack images for a species
  function getZStackImages(speciesName) {
    // Assuming z-stack images are in a "zstack" subfolder
    const zStackImages = [];
    // Load z-stack images for the species

    // Adjust as per your actual file structure
    for (let i = 1; i <= 16; i++) {
        zStackImages.push(`libraryData/${speciesName}/zstack/image${i}.jpg`);
    }
    return zStackImages;
  }
  
  // Function to open species details window
  function openSpeciesDetails(speciesName, imageData, metadata) {
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    // Close button
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";
    closeButton.onclick = function () {
      modalContent.style.display = "none";
    };
  
    // Species name
    const speciesHeading = document.createElement("h2");
    speciesHeading.classList.add("species-name");
    speciesHeading.textContent = speciesName;
  
    // Image and metadata container
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");
  
    // Display image z-planes
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageData.forEach((imageSrc) => {
      const img = document.createElement("img");
      img.src = imageSrc;
      imageContainer.appendChild(img);
    });
  
    // Display additional metadata
    const metadataContainer = document.createElement("div");
    metadataContainer.classList.add("metadata-container");
    metadata.forEach((item) => {
      const metadataItem = document.createElement("p");
      metadataItem.textContent = `${item.label}: ${item.value}`;
      metadataContainer.appendChild(metadataItem);
    });
  
    // Append elements to modal content
    contentContainer.appendChild(imageContainer);
    contentContainer.appendChild(metadataContainer);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(speciesHeading);
    modalContent.appendChild(contentContainer);
  
    // Display modal content
    document.body.appendChild(modalContent);
    modalContent.style.display = "block";
  }
  
  // Initial load of data
  loadSpeciesData();
  
  // Search functionality remains unchanged
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();
    // Implement search logic if needed
  });