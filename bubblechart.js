function createBubbleChart(data) {
    d3.select("#bubblechart").selectAll("*").remove();

    const diameter = 500;
    const svg = d3.select("#bubblechart").append("svg")
        .attr("width", diameter)
        .attr("height", diameter);

    const bubble = d3.pack(data)
        .size([diameter, diameter])
        .padding(1.5);

    const nodes = d3.hierarchy({ children: data })
        .sum(d => d.rating);

    const node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(d => !d.children)
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", d => d.r);

    node.append("text")
        .attr("dy", "-1.2em")
        .style("text-anchor", "middle")
        .style("fill", "black") 
        .style("font-size", "10px")
        .text(d => `${d.data.title}`);

    node.append("text")
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("fill", "gray") 
        .text(d => `${d.data.rating}`);


    const legendData = [
        { label: "Movie Name", color: "black" },
        { label: "Rating", color: "gray" }
    ];

    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20, 20)");

    const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("class", "legend-color")
        .attr("fill", d => d.color);

    legendItems.append("text")
        .attr("x", 15)
        .attr("dy", "0.8em")
        .text(d => d.label);

 
    function moveBubbles() {
        node.transition()
            .duration(1000)
            .attr("transform", function(d) {
                const xOffset = Math.random() * 20 - 10;
                const yOffset = Math.random() * 20 - 10;
                return `translate(${d.x + xOffset},${d.y + yOffset})`;
            })
            .on("end", moveBubbles);
    }

    moveBubbles();



}