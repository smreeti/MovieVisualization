function createDendogram(data) {

    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 100, left: 80 };
  
    // Create an SVG container
    const svg = d3.select("#dendogram")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Create hierarchical data structure
    const hierarchy = d3.hierarchy({ children: data })
      .sum(d => d.rating)
      .sort((a, b) => b.value - a.value);
  
    // Create a dendrogram layout
    const dendrogramLayout = d3.cluster()
      .size([height, width - margin.left - margin.right]);
  
    // Generate dendrogram data
    const dendrogramData = dendrogramLayout(hierarchy);
  
    // Create links with animations
    const links = svg.selectAll(".link")
      .data(dendrogramData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d => `
        M${d.source.y},${d.source.x}
        C${d.source.y + d.target.y / 2},${d.source.x}
        ${d.source.y + d.target.y / 2},${d.target.x}
        ${d.target.y},${d.target.x}
      `)
      .style("stroke", "black") // Set the border color to black
      .style("fill", "lightblue") // Fill with light blue color
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);
  
    // Create nodes with animations and scaling
    const nodes = svg.selectAll(".node")
      .data(dendrogramData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .style("opacity", 1);
  
    nodes.each(function(d) {
      const node = d3.select(this);
      node.append("circle")
        .attr("r", 5)
        .style("fill", "steelblue")
        .attr("transform", "scale(0.1)")
        .transition()
        .duration(800)
        .attr("transform", "scale(1)");
  
      node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d.children ? -10 : 10)
        .attr("text-anchor", d.children ? "end" : "start")
        .style("font-size", "10px")
        .text(d.data.title)
        .style("fill", "black");
    });
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text("Figure: Dendrogram Chart displaying the ratings of movies by Release year.");
  
}
