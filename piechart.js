const createPieChart = (data) => {
  const width = 750;
  const height = 400;
  const pieRadius = Math.min(width, height) / 2;

  const svgPie = d3
    .select("#pieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 100)
    .style("margin-top", "10px")
    .append("g")
    .attr(
      "transform",
      "translate(" + (width - 300) / 2 + "," + (height / 2 + 20) + ")"
    );

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const groupedGenresData = Array.from(d3.group(data, (d) => d.genre));

  const pie = d3
    .pie()
    .value(([, values]) => values.length)
    .sort(null);

  const arc = d3.arc().innerRadius(0).outerRadius(pieRadius);

  svgPie
    .selectAll("path")
    .data(pie(groupedGenresData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data[0]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("cursor", "pointer")
    .on("mouseover", handlePieMouseover)
    .on("mouseout", handlePieMouseout);

  const legend = svgPie
    .selectAll(".legend")
    .data(pie(groupedGenresData))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return (
        "translate(" +
        (-width / 2 + 670) +
        "," +
        (-height / 2 + 20 + i * 30) +
        ")"
      );
    });

  legend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d) => color(d.data[0]));

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text((d) => d.data[0])
    .attr("class", "legend-text")
    .style("cursor", "pointer");

  svgPie
    .append("text")
    .attr("x", width / 3 - 230)
    .attr("y", height / 2 + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("margin-top", "10px")
    .text("Fig: Pie chart showing the distribution of movie genres");

  function handlePieMouseover(event, d) {
    const genreCount = d.data[1].length;
    const percentage = ((genreCount / data.length) * 100).toFixed(2);

    // Highlight the selected arc
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr("d", d3.arc().innerRadius(0).outerRadius(pieRadius * 1.1));

    // Add tooltip label with transition
    svgPie
      .append("text")
      .attr("class", "pieDataLabel")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("transform", `translate(${arc.centroid(d)})`)
      .text(`${d.data[0]}: ${percentage}%`)
      .transition()
      .duration(200);
  }

  function handlePieMouseout(event, d) {
    // Revert the arc to its original size
    d3.select(event.currentTarget)
      .transition()
      .duration(200)
      .attr("d", arc);

    // Remove the tooltip label with transition
    svgPie
      .selectAll(".pieDataLabel")
      .transition()
      .duration(200)
      .remove();
  }
};
