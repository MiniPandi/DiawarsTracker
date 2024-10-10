const apiUrl = "https://diatracker.minipandi.net/api"
window.addEventListener('DOMContentLoaded', async () => {
  request()
  document.getElementById('refresh').addEventListener('click', async () => {
    request()
  })
});

async function request() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Assuming data contains an array of objects with a 'timestamp' property
  const labels = data.map(item => {
    const date = new Date(item.timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getHours()}:${date.getMinutes()}`;
  });

  const datasets = Object.keys(data[0].data).filter(key => ['red', 'green', 'blue', 'yellow', 'battle_royale', 'event', 'pvp', 'voting', 'nirvana', 'game', 'total'].includes(key)).map(key => {
    const dataArray = data.map(item => item.data[key]);
    let borderColor;
    let hidden = false; // Default is visible

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
      default:
        // Hide all except red, green, blue, and yellow by default
        hidden = true;
        switch (key) {
          case 'battle_royale':
            borderColor = '#5D2E8C';
            break;
          case 'event':
            borderColor = '#FF6F61';
            break;
          case 'pvp':
            borderColor = '#FFB300';
            break;
          case 'voting':
            borderColor = '#9C27B0';
            break;
          case 'nirvana':
            borderColor = '#1A535C';
            break;
          case 'game':
            borderColor = '#FF8A65';
            break;
          case 'total':
            borderColor = '#6A4C93';
            break;
        }
    }

    return {
      label: key,
      data: dataArray,
      borderColor: borderColor,
      hidden: hidden, // Hide dataset by default unless it's red, green, blue, or yellow
      fill: false,
      pointRadius: 0,
      pointHitRadius: 10
    }
  });

  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
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
            callback: function(value, index, values) {
              return value;
            }
          }
        }],
        xAxes: [{
          display: false,
          ticks: {
            autoSkip: false
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
}
