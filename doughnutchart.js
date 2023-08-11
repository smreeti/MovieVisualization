function createDoughnutChart(data) {
    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
        .select("#doughnutChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chartGroup = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal(d3.schemeSet3);

    const genres = data.map(d => d.genre);
    const uniqueGenres = Array.from(new Set(genres));

    // Shuffle the data randomly
    const shuffledData = data.sort(() => Math.random() - 0.5);

    const pie = d3.pie()
        .value(d => shuffledData.filter(movie => movie.genre === d).length)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    const arcs = chartGroup
        .selectAll("arc")
        .data(pie(uniqueGenres))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Add the path with initial opacity and grow animation
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
                return arc(interpolate(t));
            };
        });

    const labels = arcs
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .text(d => d.data);

    // Add the title below the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("Figure: Doughnut Chart displaying the ratings of movies by Release year.");
}
