window.addEventListener('DOMContentLoaded', async () => {
  const apiUrl = "https://diatracker.minipandi.net/api"

  const response = await fetch(apiUrl)
  const data = await response.json()

  // Assuming data contains an array of objects with a 'timestamp' property
  const labels = data.map(item => {
    const date = new Date(item.timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getHours()}:${date.getMinutes()}`;
  });

  const datasets = Object.keys(data[0].data).filter(key => ['red', 'green', 'blue', 'yellow'].includes(key)).map(key => {
    const dataArray = data.map(item => item.data[key]);
    let borderColor;
    switch (key) {
      case 'red':
        borderColor = '#ff0000';
        break;
      case 'green':
        borderColor = '#00ff00';
        break;
      case 'blue':
        borderColor = '#0000ff';
        break;
      case 'yellow':
        borderColor = '#ffff00';
        break;
    }
    return {
      label: key,
      data: dataArray,
      borderColor: borderColor,
      fill: false,
      pointRadius: 0, // Set pointRadius to 3 to show points
      pointHitRadius: 0 // Set pointHitRadius to 10 for better hover detection
    }
  });

  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels, // Use the modified labels array
      datasets: datasets
    },
    options: {
      title: {
        display: true,
        text: 'DiaWars Tracker'
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            min: 0,
            max: 2000,
            callback: function(value, index, values) {
              return value;
            }
          }
        }],
        xAxes: [{
          display: false, // Set display to true to show the x-axis
          ticks: {
            autoSkip: false // Show all labels
          }
        }]
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltips: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel;
          }
        }
      }
    }
  });
});