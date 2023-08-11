const createWordcloudChart = (data) => {
  const words = data.map((movie) => ({
    text: movie.title,
    size: Math.sqrt(movie.rating) * 20,
  }));

  const width = 900;
  const height = 825;

  const svg = d3
    .select("#wordcloudchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", "#666")
    .text("Fig: Wordcloud showing the movie names");

  const layout = d3.layout
    .cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => (Math.random() < 0.5 ? 0 : 90))
    .fontSize((d) => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    const textGroup = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", "0px")
      .style("fill", "steelblue")
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text((d) => d.text)
      .on("mouseover", handleTextMouseover)
      .on("mouseout", handleTextMouseout);

    function handleTextMouseover(event, d) {
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .style("font-size", (d.size + 3) + "px")
        .style("fill", "orange");
    }

    function handleTextMouseout(event, d) {
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .style("font-size", d.size + "px")
        .style("fill", "steelblue");
    }

    textGroup
      .transition()
      .duration(1000)
      .style("font-size", (d) => d.size + "px");
  }
}
