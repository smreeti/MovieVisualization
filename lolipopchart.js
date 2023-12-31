function createLollipopChart(data) {
  const margin = { top: 40, right: 30, bottom: 80, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#lolipopChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 600)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.title))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.rating)])
    .nice()
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  svg.selectAll(".line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("x1", (d) => x(d.title) + x.bandwidth() / 2)
    .attr("x2", (d) => x(d.title) + x.bandwidth() / 2)
    .attr("y1", height)
    .attr("y2", height)
    .attr("stroke", (d, i) => colorScale(i))
    .attr("stroke-width", 5)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .attr("y2", (d) => y(d.rating));

  const donutRadius = 10;
  const donutWidth = 5;

  svg.selectAll(".donut")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "donut")
    .attr("cx", (d) => x(d.title) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.rating))
    .style("cursor", "pointer")
    .on("mouseover", handleScatterPlotMouseover)
    .on("mouseout", handleScatterPlotMouseout)
    .attr("r", donutRadius)
    .attr("fill", "white")
    .attr("stroke", (d, i) => colorScale(i))
    .attr("stroke-width", donutWidth);

  const xAxis = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-15)")
    .style("text-anchor", "end");

  const yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(5));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.top + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("Fig: Lollipop Chart showing the ratings of movies by title");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .text("Rating");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.top)
    .attr("dy", "2em")
    .attr("text-anchor", "middle")
    .text("Movie Title");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left)
    .attr("dy", "-2.5em")
    .attr("text-anchor", "middle")
    .text("Rating");

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