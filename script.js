const svg = d3.select("#viz");
const width = document.getElementById("graphic").clientWidth;
const height = document.getElementById("graphic").clientHeight;
svg.attr("viewBox", `0 0 ${width} ${height}`);

const scroller = scrollama();

function drawSkyline() {
  svg.selectAll("*").remove();
  const heights = [500, 800, 1050, 750, 580, 320, 260];
  svg.selectAll("rect")
    .data(heights)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 60 + 50)
    .attr("y", d => height - d)
    .attr("width", 40)
    .attr("height", d => d)
    .attr("fill", "#aaa");
}

function drawElevatorChart() {
  svg.selectAll("*").remove();
  const data = [80, 130, 110, 140, 120, 130, 100, 120, 105];
  const years = d3.range(2017, 2026);
  
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 60 + 40)
    .attr("y", d => height - d)
    .attr("width", 40)
    .attr("height", d => d)
    .attr("fill", "#444");

  svg.selectAll("text")
    .data(years)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 60 + 45)
    .attr("y", height - 5)
    .text(d => d)
    .attr("font-size", "12px");
}

function zoomIntoBuilding() {
  svg.selectAll("*").remove();
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      svg.append("rect")
        .attr("x", 80 + c * 40)
        .attr("y", 100 + r * 40)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", "#ccc")
        .attr("stroke", "#000");
    }
  }

  svg.append("text")
    .attr("x", 80)
    .attr("y", 70)
    .text("764 East 152 Street, Bronx")
    .attr("font-size", "14px");

  svg.append("text")
    .attr("x", 80)
    .attr("y", 90)
    .text("Date: 2nd of January 2025")
    .attr("font-size", "12px");
}

// Scrollama setup
scroller
  .setup({
    step: ".step",
    offset: 0.5,
    debug: false
  })
  .onStepEnter(response => {
    const step = response.index;
    if (step === 0) drawSkyline();
    if (step === 1) drawElevatorChart();
    if (step === 2) zoomIntoBuilding();
  });

// Draw initial view
drawSkyline();
