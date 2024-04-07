let barChart; 

document.addEventListener('DOMContentLoaded', function () {

        // Function to create/update the bar chart
    function createOrUpdateChart(inputData) {
        const sortedItems = Object.keys(inputData).sort((a, b) => inputData[b] - inputData[a]);
        const itemLabels = sortedItems.map(item => item.toUpperCase());
        const itemOccurrences = sortedItems.map(item => inputData[item]);
    
        if (barChart) {
        // Update existing chart with new data
        barChart.data.labels = itemLabels;
        barChart.data.datasets[0].data = itemOccurrences;
        barChart.update();
        } else {
        // Create new chart
        const ctx = (document.getElementById('barChart')).getContext('2d');
        console.log(inputData)
    
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: itemLabels,
            datasets: [{
                label: 'Pollen Occurrences',
                data: itemOccurrences,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 0,
                barThickness: 8
            }]
            },
            options: {
            indexAxis: 'y',
            scales: {
                x: {
                beginAtZero: true
                },
            },
            layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10
                }
              },
              plugins: {
                legend: {
                  position: 'right'
                }
              },
              // Adjust spacing between bars
              barPercentage: 0.9, // Decrease bar spacing
              categorySpacing: 0 // Decrease category spacing
            }
        });
        }
    }
  

    // Initial chart creation
    createOrUpdateChart({}); // Create chart with empty data


    // Expose createOrUpdateChart globally for use in other files
    window.createOrUpdateChart = createOrUpdateChart;  
});






