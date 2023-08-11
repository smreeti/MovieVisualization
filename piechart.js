const createPieChart = (data) => {
  const width = 800;
  const height = 400;
  const pieRadius = Math.min(width, height) / 2;

  const svgPie = d3
    .select("#pieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 50)
    .append("g")
    .attr(
      "transform",
      "translate(" + (width - 300) / 2 + "," + height / 2 + ")"
    );

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const genres = data.map((d) => d.genre);
  const uniqueGenres = Array.from(new Set(genres));

  const pie = d3
    .pie()
    .value((d) => data.filter((movie) => movie.genre === d).length)
    .sort(null);

  const arc = d3.arc().innerRadius(0).outerRadius(pieRadius);

  const path = svgPie
    .selectAll("path")
    .data(pie(uniqueGenres))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("cursor", "pointer")
    .on("mouseover", handlePieMouseover)
    .on("mouseout", handlePieMouseout);

  const legend = svgPie
    .selectAll(".legend")
    .data(pie(uniqueGenres))
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
    .style("fill", (d) => color(d.data));

  legend
    .append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text((d) => d.data)
    .attr("class", "legend-text")
    .style("cursor", "pointer");

  svgPie
    .append("text")
    .attr("x", width / 3 - 230)
    .attr("y", height / 2 + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("margin-top", "10px")
    .style("fill", "#666")
    .text("Fig: Pie chart showing the distribution of movie genres");

  function handlePieMouseover(event, d) {
    const genreCount = data.filter((movie) => movie.genre === d.data).length;
    const percentage = ((genreCount / data.length) * 100).toFixed(2);
    path.attr("opacity", 0.5);

    path.transition().duration(200).attr("opacity", 0.5);
    d3.select(event.currentTarget).transition().duration(200).attr("opacity", 1);

    svgPie
      .append("text")
      .attr("class", "pieDataLabel")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .attr("transform", `translate(${arc.centroid(d)})`)
      .text(`${d.data}: ${percentage}%`)
      .style("opacity", 0)
      .transition()
      .duration(200)
      .style("opacity", 1);
  }

  function handlePieMouseout(event, d) {
    path.transition().duration(200).attr("opacity", 1);

    svgPie
      .selectAll(".pieDataLabel")
      .transition()
      .duration(200)
      .style("opacity", 0)
      .remove();

    d3.select("#pieChartPercentage").style("display", "none");
  }
}
