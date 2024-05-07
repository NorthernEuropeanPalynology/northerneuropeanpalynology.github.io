document.addEventListener("DOMContentLoaded", function () {
    const svg = document.getElementById("progress-ring");
    const size = 160; // SVG size
    const strokeWidth = 15; // Stroke width of each line
    const radius = (size - strokeWidth) / 2; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle

    // Create the background circle
    const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bgCircle.setAttribute("cx", size / 2);
    bgCircle.setAttribute("cy", size / 2);
    bgCircle.setAttribute("r", radius);
    bgCircle.setAttribute("stroke", "#e6e6e6");
    bgCircle.setAttribute("stroke-width", strokeWidth);
    bgCircle.setAttribute("fill", "none");
    svg.appendChild(bgCircle);

    // Create the progress circle
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.setAttribute("cx", size / 2);
    progressCircle.setAttribute("cy", size / 2);
    progressCircle.setAttribute("r", radius);
    progressCircle.setAttribute("stroke", "#53a7fc");
    progressCircle.setAttribute("stroke-width", strokeWidth);
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke-dasharray", circumference);

    // Rotate the circle 90 degrees to the left
    progressCircle.setAttribute("transform", "rotate(-90, " + (size / 2) + ", " + (size / 2) + ")");

    svg.appendChild(progressCircle);

    // Create text for percentage
    const textPercentage = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textPercentage.setAttribute("x", size / 2);
    textPercentage.setAttribute("y", size / 2 - 10);
    textPercentage.setAttribute("text-anchor", "middle");
    textPercentage.setAttribute("alignment-baseline", "central");
    textPercentage.setAttribute("font-size", "54px");
    textPercentage.setAttribute("fill", "#333");
    svg.appendChild(textPercentage);

    // Create text for "species digitized"
    const textSpecies = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textSpecies.setAttribute("x", size / 2);
    textSpecies.setAttribute("y", size / 2 + 40); // Adjust Y position as needed
    textSpecies.setAttribute("text-anchor", "middle");
    textSpecies.setAttribute("font-size", "20px");
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
});
  