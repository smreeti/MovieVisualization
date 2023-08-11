const createScatterPlot = (data) => {
    const scatterWidth = 800;
    const scatterHeight = 450;
    const scatterPlotMargin = {
        top: 30,
        right: 30,
        bottom: 70,
        left: 60
    };
    const scatterPlotInnerWidth = scatterWidth - scatterPlotMargin.left - scatterPlotMargin.right;
    const scatterPlotInnerHeight = scatterHeight - scatterPlotMargin.top - scatterPlotMargin.bottom;

    const svgScatterPlot = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", scatterWidth)
        .attr("height", scatterHeight + 50)
        .append("g")
        .attr("transform", `translate(${scatterPlotMargin.left}, ${scatterPlotMargin.top})`);

    const xScaleScatterPlot = d3.scaleLinear()
        .domain(d3.extent(data, d => d.releaseYear))
        .range([0, scatterPlotInnerWidth]);

    const yScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.rating)])
        .range([scatterPlotInnerHeight, 0]);

    const xAxisScatter = d3.axisBottom(xScaleScatterPlot).ticks(10);
    const yAxisScatter = d3.axisLeft(yScaleScatterPlot);

    svgScatterPlot.append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${scatterPlotInnerHeight})`)
        .call(xAxisScatter);

    svgScatterPlot.append("g")
        .attr("class", "axis-y")
        .call(yAxisScatter);

    svgScatterPlot.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScaleScatterPlot(d.releaseYear))
        .attr("cy", d => yScaleScatterPlot(d.rating))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .style("cursor", "pointer")
        .on("mouseover", handleScatterPlotMouseover)
        .on("mouseout", handleScatterPlotMouseout)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    svgScatterPlot.append("text")
        .attr("class", "axis-label")
        .attr("x", scatterPlotInnerWidth / 2)
        .attr("y", scatterPlotInnerHeight + scatterPlotMargin.top + 30)
        .attr("text-anchor", "middle")
        .text("Release Year");

    svgScatterPlot.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -scatterPlotInnerHeight / 2)
        .attr("y", -scatterPlotMargin.left + 15)
        .attr("text-anchor", "middle")
        .text("Rating");

    svgScatterPlot
        .append("text")
        .attr("x", scatterPlotInnerWidth / 2)
        .attr("y", scatterPlotInnerHeight + scatterPlotMargin.top + scatterPlotMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#666")
        .text("Fig: Scatter Chart showing the ratings of movies by Release Year");

    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip");

    function handleScatterPlotMouseover(event, d) {
        tooltip
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style("display", "block")
            .html(`<strong>${d.title}</strong>
            <br>Genre: ${d.genre}<br>Rating: ${d.rating}<br>Release Year: ${d.releaseYear}`);
    }

    function handleScatterPlotMouseout(event, d) {
        tooltip.style("display", "none");
    }
}
