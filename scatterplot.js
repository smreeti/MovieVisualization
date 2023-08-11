function createScatterPlot(data) {
    const scatterWidth = 800;
    const scatterHeight = 450;
    const scatterMargin = { top: 30, right: 30, bottom: 70, left: 60 };
    const scatterInnerWidth = scatterWidth - scatterMargin.left - scatterMargin.right;
    const scatterInnerHeight = scatterHeight - scatterMargin.top - scatterMargin.bottom;

    const svgScatter = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", scatterWidth)
        .attr("height", scatterHeight + 50)
        .append("g")
        .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`);

    const xScaleScatter = d3.scaleLinear()
        .domain(d3.extent(data, d => d.releaseYear))
        .range([0, scatterInnerWidth]);

    const yScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.rating)])
        .range([scatterInnerHeight, 0]);

    const xAxisScatter = d3.axisBottom(xScaleScatter).ticks(10);
    const yAxisScatter = d3.axisLeft(yScaleScatter);

    svgScatter.append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${scatterInnerHeight})`)
        .call(xAxisScatter);

    svgScatter.append("g")
        .attr("class", "axis-y")
        .call(yAxisScatter);

    svgScatter.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScaleScatter(d.releaseYear))
        .attr("cy", d => yScaleScatter(d.rating))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .style("cursor", "pointer")
        .on("mouseover", handleScatterMouseover)
        .on("mouseout", handleScatterMouseout);

    // Add x-axis label
    svgScatter.append("text")
        .attr("class", "axis-label")
        .attr("x", scatterInnerWidth / 2)
        .attr("y", scatterInnerHeight + scatterMargin.top + 30)
        .attr("text-anchor", "middle")
        .text("Release Year");

    // Add y-axis label
    svgScatter.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -scatterInnerHeight / 2)
        .attr("y", -scatterMargin.left + 15)
        .attr("text-anchor", "middle")
        .text("Rating");

    //Add caption
    svgScatter
        .append("text")
        .attr("x", scatterInnerWidth / 2)
        .attr("y", scatterInnerHeight + scatterMargin.top + scatterMargin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#666")
        .text("Fig: Scatter Chart showing the ratings of movies by Release Year");
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip");

    function handleScatterMouseover(event, d) {
        tooltip
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style("display", "block")
            .html(`<strong>${d.title}</strong><br>Genre: ${d.genre}<br>Rating: ${d.rating}<br>Release Year: ${d.releaseYear}`);
    }

    function handleScatterMouseout(event, d) {
        tooltip.style("display", "none");
    }
}
