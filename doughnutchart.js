function createDoughnutChart(data) {
    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3
        .select("#doughnutChart")
        .append("svg")
        .attr("width", width + 20)
        .attr("height", height + 20);

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const genres = data.map(d => d.genre);
    const uniqueGenres = Array.from(new Set(genres));

    const pie = d3.pie()
        .value(d => data.filter(movie => movie.genre === d).length)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 0.9);

    const arcs = chartGroup
        .selectAll("arc")
        .data(pie(uniqueGenres))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("click", handleArcClick);

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .attrTween("d", function (d) {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });

    const labels = arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .text(d => `${d.data}\n(${((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100}%)`);

    const legend = svg.selectAll(".legend")
        .data(uniqueGenres)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 100},${i * 20 + 20})`)
        .on("click", handleLegendClick);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => color(i));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text("Figure: Doughnut Chart displaying the ratings of movies by genre percentages.");

    function handleArcClick(event, d) {
        const isSelected = d3.select(this).classed("selected");

        arcs.classed("selectedPie", false);
        legend.style("opacity", 1);

        if (!isSelected) {
            d3.select(this).classed("selectedPie", true);
            legend.style("opacity", (legendData) => legendData === d.data ? 1 : 0.5)
            legend.style("font-weight", "bold");
        }
    }

    function handleLegendClick(event, d) {
        const isSelected = d3.select(this).classed("selected");

        legend.classed("selectedPie", false);
        arcs.style("opacity", 0.5);
        arcs.classed("selectedPie", false);

        if (!isSelected) {
            d3.select(this).classed("selectedPie", true);
            const selectedArc = arcs.filter((arcData) => arcData.data === d);
            selectedArc
                .style("fill", (arcData) => color(uniqueGenres.indexOf(arcData.data)))
                .style("opacity", 1)
                .classed("selectedPie", true);
        } else {
            arcs.style("opacity", 1);
        }
    }
}
