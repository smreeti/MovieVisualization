const createScatterPlot = (data) => {
    const scatterWidth = 750;
    const scatterHeight = 450;
    const scatterPlotMargin = {
        top: 30,
        right: 30,
        bottom: 70,
        left: 120
    };
    const scatterPlotInnerWidth = scatterWidth - scatterPlotMargin.left - scatterPlotMargin.right;
    const scatterPlotInnerHeight = scatterHeight - scatterPlotMargin.top - scatterPlotMargin.bottom;
    let tooltipVisible = false;

    const svgScatterPlot = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", scatterWidth)
        .attr("height", scatterHeight + 50)
        .append("g")
        .attr("transform", `translate(${scatterPlotMargin.left}, ${scatterPlotMargin.top})`);

    const xScaleScatterPlot = d3.scaleLinear()
        .domain(d3.extent(data, d => d.releaseYear))
        .range([0, scatterPlotInnerWidth]);

    const yScaleScatterPlot = d3.scaleBand()
        .domain(data.map(d => d.genre))
        .range([scatterPlotInnerHeight, 0])
        .padding(0.1);

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
        .attr("cy", d => yScaleScatterPlot(d.genre) + yScaleScatterPlot.bandwidth() / 2)
        .attr("r", 6)
        .attr("fill", "steelblue")
        .style("cursor", "pointer")
        .on("mouseover", handleScatterPlotMouseover)
        .on("mouseout", handleScatterPlotMouseout)
        .style("opacity", 0)
        .transition()
        .duration(800)
        .style("opacity", 1)
        .delay((d, i) => i * 100)
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
        .text("Genre");

    svgScatterPlot
        .append("text")
        .attr("x", scatterPlotInnerWidth / 2)
        .attr("y", scatterPlotInnerHeight + scatterPlotMargin.top + scatterPlotMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Fig: Scatter Chart showing the genres of movies by Release Year");

    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip");

    function handleScatterPlotMouseover(event, d) {
        d3.select(event.currentTarget)
            .transition()
            .attr("r", 8);

        if (!tooltipVisible) {
            tooltip
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .style("display", "block")
                .html(`<strong>Movie:</strong> ${d.title}<br>
                    <strong> Genre:</strong> ${d.genre}<br>
                    <strong>Rating: </strong>${d.rating}<br>
                   <strong>Release Year:</strong> ${d.releaseYear}`);
            tooltipVisible = true; // Set tooltip as visibl
        }
    }

    function handleScatterPlotMouseout(event, d) {
        d3.select(event.currentTarget)
            .interrupt()
            .transition()
            .attr("r", 5);

        setTimeout(() => {
            tooltip.style("display", "none");
            tooltipVisible = false; // Set tooltip as not visible
        }, 300);
    }
}
