// Create the background circle
const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
const textPercentage = document.createElementNS("http://www.w3.org/2000/svg", "text");
const textSpecies = document.createElementNS("http://www.w3.org/2000/svg", "text");

function updateSVG() {
    const svg = document.getElementById("progress-ring");
    const size = Math.min(svg.getBoundingClientRect().width, svg.getBoundingClientRect().height);
    const cx = svg.getBoundingClientRect().width/2;
    const cy = svg.getBoundingClientRect().height/2
    const strokeWidth = 15; // Stroke width of each line
    const radius = (size - strokeWidth) / 2; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle

    
    bgCircle.setAttribute("cx", cx);
    bgCircle.setAttribute("cy", cy);
    bgCircle.setAttribute("r", radius);
    bgCircle.setAttribute("stroke", "#e6e6e6");
    bgCircle.setAttribute("stroke-width", strokeWidth);
    bgCircle.setAttribute("fill", "none");
    svg.appendChild(bgCircle);

    // Create the progress circle
    
    progressCircle.setAttribute("cx", cx);
    progressCircle.setAttribute("cy", cy);
    progressCircle.setAttribute("r", radius);
    progressCircle.setAttribute("stroke", "#53a7fc");
    progressCircle.setAttribute("stroke-width", strokeWidth);
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke-dasharray", circumference);

    // Rotate the circle 90 degrees to the left
    progressCircle.setAttribute("transform", "rotate(-90, " + cx + ", " + cy + ")");

    svg.appendChild(progressCircle);

    // Create text for percentage
    
    textPercentage.setAttribute("x", cx);
    textPercentage.setAttribute("y", cy);
    textPercentage.setAttribute("text-anchor", "middle");
    textPercentage.setAttribute("alignment-baseline", "central");
    textPercentage.setAttribute("font-size", "2rem");
    textPercentage.setAttribute("fill", "#333");
    svg.appendChild(textPercentage);

    // Create text for "species digitized"
    
    textSpecies.setAttribute("x", cx);
    textSpecies.setAttribute("y", cy + 40); // Adjust Y position as needed
    textSpecies.setAttribute("text-anchor", "middle");
    textSpecies.setAttribute("font-size", "1.5rem");
    textSpecies.setAttribute("fill", "#666");
    textSpecies.textContent = "Species";
    svg.appendChild(textSpecies);

    // Update progress and text
    function updateProgress(percentage) {
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.setAttribute("stroke-dashoffset", offset);
        progressCircle.style.stroke = getColor(percentage);

        // Update text content
        textPercentage.textContent = percentage;
    }
    // Calculate color based on progress value
    function getColor(percentage) {
        if (percentage >= 75) return "green";
        else if (percentage >= 50) return "orange";
        else return "red";
    }

    // Example: Update progress to 60%
    updateProgress(12);
}

document.addEventListener("DOMContentLoaded", updateSVG)
window.addEventListener("resize", updateSVG)
  