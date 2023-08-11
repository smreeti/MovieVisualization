function createWorldcloudChart(data) {
 

    const words = data.map(movie => ({ text: movie.title, size: Math.sqrt(movie.rating) * 20 }));

    const width = 500;
    const height = 500;

    const svg = d3.select("#Wordcloudchart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (Math.random() < 0.5 ? 0 : 90))
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", "steelblue")
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
}
}