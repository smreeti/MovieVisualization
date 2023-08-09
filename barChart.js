function createBarChart(data) {

  const margin = { top: 40, right: 30, bottom: 100, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const fontSize = "12px";


  d3.select("#barchart").selectAll("*").remove();

  const svg = d3
    .select("#barchart")
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
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.title))
    .attr("y", (d) => y(d.rating))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.rating))
    .on("mousemove", handleBarMousemove)
    .on("mouseout", handleBarMouseout);

  svg
    .selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => x(d.title) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.rating) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.rating);

  svg
    .append("text")
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
    .text("Rating")
    .style("font-size", fontSize);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("dy", "-2.5em")
    .attr("text-anchor", "middle")
    .style("font-size", fontSize)
    .text("(Rating)");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Movie Ratings");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", fontSize)
    .style("font-weight", "bold")
    .style("fill", "#666")
    .attr("dy", "1.5em")
    .text("Fig: Chart showing the ratings of movies by title");

  // Tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("display", "none");

  function handleBarMousemove(event, d) {
    tooltip
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px")
      .style("display", "block")
      .html(
        `<strong>${d.title}</strong><br>Genre: ${d.genre}<br>Rating: ${d.rating}<br>Release Year: ${d.releaseYear}`
      );
  }

  function handleBarMouseout() {
    tooltip.style("display", "none");
  }
}
