const csvUrl =
  "https://raw.githubusercontent.com/smreeti/MovieVisualization/main/movies.csv";

const chartContainers = {
  scatterChart: document.getElementById("scatterPlot"),
  pieChartDiv: document.getElementById("pieChart"),
  barChartDiv: document.getElementById("barchart"),
  lolipopSVG: document.getElementById("lolipopChart"),
  connectedScatterChartDiv: document.getElementById('connectedScatterChart'),
  doughnutChartDiv: document.getElementById('doughnutChart'),
  bubblechartSVG: document.getElementById('bubblechartSVG'),  
  WordcloudchartSVG: document.getElementById('WordcloudchartSVG')
};

function clearAllCharts() {
  Object.values(chartContainers).forEach((container) => {
    container.style.display = "none";
    clearChart(container);
  });
}

function clearChart(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function showChart(chartType) {
  clearAllCharts();

  chartContainers[chartType].style.display = "block";

  d3.csv(csvUrl).then((data) => {
    switch (chartType) {
      case 'scatterChart':
        createScatterPlot(data);
        break;
      case 'pieChartDiv':
        createPieChart(data);
        break;
      case "barChartDiv":
        data.forEach((d) => {
          d.rating = +d.rating;
        });
        createBarChart(data);
        break;
      case "lolipopSVG":
        data.forEach((d) => {
          d.rating = +d.rating;
        });
        createLollipopChart(data);
        break;
      case 'doughnutChartDiv':
        createDoughnutChart(data);
        break; 
        

      case 'connectedScatterChartDiv':
        createConnectedScatterPlot(data);
        break;
      
        case 'bubblechartSVG':
          createBubbleChart(data);
          break;

          case 'WordcloudchartSVG':
            createWorldcloudChart(data);
            break;

          

        
    }
  });
}

// to initially load pie chart by default
window.addEventListener('load', () => {
  showChart('pieChartDiv');
});
