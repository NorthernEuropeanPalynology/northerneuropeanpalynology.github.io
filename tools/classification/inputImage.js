const model = new Model();
let draggedItem = null;
let imageItems = [];

let data = {
    Apiaceae:0,  
    Artemisia:0, 
    Betula:0,
    Chenopodiaceae:0,
    Cyperaceae:0,
    Helianthemum:0,
    Lycopodium:0,
    NPP_CLASS1:0,
    NPP_CLASS2:0,
    NPP_CLASS3:0,
    NPP_CLASS4:0,
    Pinus:0,
    Poaceae:0,
    Salix: 0,
    Varia:0,
};

document.addEventListener('DOMContentLoaded', function () {
    createOrUpdateChart(data); // Call the function with new data
});

function loadFiles(event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');
    

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const uploadedImage = document.createElement('img');
                uploadedImage.classList.add('uploadedImage');
                uploadedImage.src = img.src;
                

                // Set ID for each image to identify them during drag and drop
                uploadedImage.id = `image${i}`;

                // Push filename to global array
                imageItems.push(`image${i}`);
                updateImageCount();

                const fileName = document.createElement('div');
                fileName.classList.add('fileName');
                const [category, probability] = model.predict(img);

                outputText = (true || probability > 0.5) ? category : "Varia";
                data[outputText] = data[outputText] + 1
                createOrUpdateChart(data);
                outputText += "\t\t"
                outputText += (true || probability > 0.5) ? parseFloat(probability * 100).toFixed(2) : "";
                outputText += "%";

                fileName.innerText = outputText;

                const deleteIcon = document.createElement('div');
                deleteIcon.classList.add('deleteIcon');
                deleteIcon.innerHTML = "X";
                

                const imageBox = document.createElement('div');
                imageBox.classList.add('imageBox');
                imageBox.setAttribute('draggable', 'true');
                imageBox.appendChild(uploadedImage);
                imageBox.appendChild(fileName);
                imageBox.appendChild(deleteIcon);

                imageContainer.appendChild(imageBox);
                enableDragAndDrop(imageBox);
                deleteIcon.addEventListener('click', deleteItem)
            };
        };
        reader.readAsDataURL(file);
    }
}


function enableDragAndDrop(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
}

function deleteItem(event){
    item = event.target;
    console.log("DELETED");
    const imageContainer = item.parentNode.parentNode;
    imageContainer.removeChild(item.parentNode)
}


function handleDragStart(event) {
    draggedItem = event.target;
    event.dataTransfer.setData('text/plain', event.target.id);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(event) {
    event.preventDefault();
    event.target.style.opacity = '0.5'; // Highlight drop target
}

function handleDragLeave(event) {
    event.target.style.opacity = '1'; // Remove highlight when leaving drop target
}

function handleDrop(event) {
    event.preventDefault();
    event.target.style.opacity = '1'; // Reset opacity

    const droppedItem = event.target;
    if (draggedItem !== droppedItem) {
        const container = droppedItem.parentNode;
        const items = Array.from(container.children);

        const draggedIndex = items.indexOf(draggedItem);
        const droppedIndex = items.indexOf(droppedItem);

        if (draggedIndex >= 0 && droppedIndex >= 0) {
            container.insertBefore(draggedItem, droppedIndex > draggedIndex ? droppedItem.nextSibling : droppedItem);
        }
    }
}


function updateImageCount(){
    const valueText = document.getElementById("imagesUploaded");

    valueText.textContent = imageItems.length
}
