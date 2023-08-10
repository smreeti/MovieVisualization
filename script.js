const csvUrl = 'https://raw.githubusercontent.com/smreeti/MovieVisualization/main/movies.csv';

const chartContainers = {
    'scatterChart': document.getElementById('scatterPlot'),
    'pieChartDiv': document.getElementById('pieChart'),
    'connectedScatterChartDiv': document.getElementById('connectedScatterChart'),
    'doughnutChartDiv': document.getElementById('doughnutChart'),
};

function clearAllCharts() {
    Object.values(chartContainers).forEach(container => {
        container.style.display = 'none';
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

    chartContainers[chartType].style.display = 'block';

    d3.csv(csvUrl).then((data) => {
        switch (chartType) {
            case 'scatterChart':
                createScatterPlot(data);
                break;
            case 'pieChartDiv':
                createPieChart(data);
                break;
            case 'doughnutChartDiv':
                createDoughnutChart(data);
                break;
            case 'connectedScatterChartDiv':
                createConnectedScatterPlot(data);
                break;
        }
    });
}

// to initially load pie chart by default
window.addEventListener('load', () => {
    showChart('pieChartDiv');
});
