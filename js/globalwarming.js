
"use strict";

function globalwarming(data_emissions, data_temperatures) {

    /***** processing data *****/

    const emissions = d3.nest()
        // arrange per year
        .key(d => d.Year)
        // sum all the emissions (GigaGrams)
        .rollup(a => d3.sum(a.map(d => d.Value)))
        .entries(data_emissions);
    // console.log(emissions)

    const temperature = d3.nest()
        // arrange per year
        .key(d => {
            // dt is format 'yyyy-mm-dd'
            const date = d.dt;
            return date.split('-')[0];
        })
        // average of temperature
        .rollup(a => d3.mean(a.map(d => d.LandAverageTemperature)))
        .entries(data_temperatures);
    // console.log(temperature)

    var data = [];
    temperature.forEach(year => {
        const tryValue = emissions.find(d => d.key == year.key);
        if (tryValue) {
            data.push({
                year: year.key,
                temperature: year.value,
                emission: tryValue.value
            })
        }
    });
    // console.log(data)

    return data
}

function domains_GW(d3, x, y, data) {
    xDomain_GW(d3, x, data);
    yDomain_GW(d3, y, data);
}
function xDomain_GW(d3, x, data) {
    const emission = data.map(d => d.emission);
    x.domain([d3.min(emission), d3.max(emission)])
}
function yDomain_GW(d3, y, data) {
    const temperature = data.map(d => d.temperature);
    y.domain([d3.min(temperature), d3.max(temperature)])
}


const margin = { top: 0, right: 50, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    text_height = 20;

function create_GW(d3) {

    // append the svg object to the body of the page
    var svg = d3.select("#global_warming")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + text_height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    return {
        svg: svg,
        x: x,
        y: y
    };
}

function chart_GW(svg, x, y, data) {
    console.log(data.length)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Emissions (GigaGrams)");

    svg.append("g")
        .call(d3.axisLeft(y));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (°C)");

    // from https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
    var inputForHexbinFun = []
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.emission), y(d.temperature)])  // Note that we had the transform value of X and Y !
    })

    /*var color = d3.scaleLinear()
        .domain([0, 6]) // Number of points in the bin?
        .range(["#f1adb9", "#581420"]);*/
    var color = d3.scaleOrdinal()
    .domain([0, 6])
    .range(["#fbebed", "#f1adb9", "#e67084", "#db334f", "#992437", "#581420"])    
    // color-light2, color-dark2

    var hexbin = d3.hexbin()
        .radius(30) // size of the bin in px
        .extent([[0, 0], [width, height]])

    // Plot the hexbins
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("fill", d => color(d.length))
        // .attr("stroke", "black")
        // .attr("stroke-width", "0.1")

}