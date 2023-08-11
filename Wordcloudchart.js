function createWordcloudChart(data) {
    const words = data.map((movie) => ({
      text: movie.title,
      size: Math.sqrt(movie.rating) * 20,
    }));
    
    const width = 800;
    const height = 800;
  
    const svg = d3
      .select("#wordcloudchart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
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
        .style("font-size", "0px") // Start with font size 0
        .style("fill", "steelblue")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
  
      // Apply transition for fade-in effect
      textGroup
        .transition()
        .duration(1000) // Adjust the duration as needed
        .style("font-size", (d) => d.size + "px");
    }
  }
  