// Set up SVG Area
var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top -margin.bottom;

//Implementing SVG Wrapper and adding SVG group to hold chart

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

var chartGroup = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Import Data
d3.csv("data.csv", function(err, csvdata) {
    if (err) throw err;

    // Parse Data as Numbers
    csvdata.forEach(function(data){
        data.Heavy_Drinker = +data.Heavy_Drinker
        data.Employment = +data.Employment;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(csvdata, d => d.Heavy_Drinker)])
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .domain([35, d3.max(csvdata, d => d.Employment)])
        .range([0, width]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending X-Axis to Chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // Appending Y-Axis to Chart
    chartGroup.append("g")
    .attr("class", "y axis")
    .call(leftAxis);
    //Creating Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.Employment))
    .attr("cy", d => yLinearScale(d.Heavy_Drinker))
    .attr("r", "15")
    .attr("fill", "gold")
    .attr("opacity", ".5");

    // Tool Tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.Abbr}<br>% Heavy Drinkers: ${d.Heavy_Drinker}<br>% Employed: ${d.Employment}`);
    });

    // Create tooltup in the chart
    chartGroup.call(toolTip);

    // Creating Event Listenters for ToolTip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })
    //Mouseout
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });

    //Create Axes Labels
    // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("% of Heavy Drinkers per State");
  
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("% of Employed Citizens per State");
});

      


   

