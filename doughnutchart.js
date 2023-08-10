function createDoughnutChart(data) {
    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svgDoughnut = d3
        .select("#doughnutChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    const genres = data.map(d => d.genre);
    const uniqueGenres = Array.from(new Set(genres));

    const pie = d3
        .pie()
        .value((d) => data.filter(movie => movie.genre === d).length)
        .sort(null);

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    const arcs = svgDoughnut
        .selectAll("arc")
        .data(pie(uniqueGenres))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("cursor", "pointer")
        .on("mouseover", handleDoughnutMouseover)
        .on("mouseout", handleDoughnutMouseout);


    const legend = svgDoughnut
        .selectAll(".legend")
        .data(pie(uniqueGenres))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + (-width / 2 + 670) + "," + (-height / 2 + 20 + i * 30) + ")";
        });

    legend
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", (d, i) => color(i));

    legend
        .append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text((d) => (d.data))
        .attr("class", "legend-text")
        .style("cursor", "pointer");

    function handleDoughnutMouseover(event, d) {
        const genreCount = data.filter(movie => movie.genre === d.data).length;
        const percentage = ((genreCount / data.length) * 100).toFixed(2);
    
        arcs.selectAll("path")
            .attr("opacity", 0.7);
    
        d3.select(event.currentTarget)
            .attr("opacity", 1);
    
        svgDoughnut
            .append("text")
            .attr("class", "doughnutDataLabel")
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .attr("transform", `translate(${arc.centroid(d)})`)
            .text(`${d.data}: ${percentage}%`);
    }
    
    function handleDoughnutMouseout(event, d) {
        arcs.selectAll("path")
            .attr("opacity", 1);
    
        d3.selectAll(".doughnutDataLabel").remove();
    }
}

d3.csv("movies.csv").then(function(data) {
    data.forEach(function(d) {
        d.rating = +d.rating;
    });

    createDoughnutChart(data);
});
