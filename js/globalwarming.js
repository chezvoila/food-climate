
"use strict";

/****************** STATIC VARIABLES ******************/

let data_GW;

let elements;
let svg_GW,
    x_GW,
    y_GW;

function globalwarming(data_emissions, data_temperatures) {

    data_GW = get_data_GW(data_emissions, data_temperatures);

    elements = create_GW();
    svg_GW = elements.svg,
        x_GW = elements.x,
        y_GW = elements.y;

    // update domains
    xDomain_GW(x_GW, data_GW);
    yDomain_GW(y_GW, data_GW);

    // create and display the chart
    chart_GW(svg_GW, x_GW, y_GW, data_GW);
}


function get_data_GW(data_emissions, data_temperatures) {

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
                emission: tryValue.value / 1e6 // in GigaTons and not GigaGrams
            })
        }
    });
    // console.log(data)

    return data
}

function xDomain_GW(x, data) {
    const emission = data.map(d => d.emission);
    x.domain([d3.min(emission), d3.max(emission)])
}
function yDomain_GW(y, data) {
    const temperature = data.map(d => d.temperature);
    y.domain([d3.min(temperature), d3.max(temperature)])
}


var margin_GW = { top: 0, right: 50, bottom: 30, left: 50 },
    width_GW = 600 - margin_GW.left - margin_GW.right,
    height_GW = 500 - margin_GW.top - margin_GW.bottom,
    text_height_GW = 20;

function create_GW() {

    // append the svg object to the body of the page
    var svg = d3.select("#global_warming")
        .append("svg")
        .attr("width", width_GW + margin_GW.left + margin_GW.right)
        .attr("height", height_GW + margin_GW.top + margin_GW.bottom + text_height_GW)
        .append("g")
        .attr("transform",
            "translate(" + margin_GW.left + "," + margin_GW.top + ")");

    var x = d3.scaleLinear().range([0, width_GW]),
        y = d3.scaleLinear().range([height_GW, 0]);

    return {
        svg: svg,
        x: x,
        y: y
    };
}

function chart_GW(svg, x, y, data) {
    // console.log(data.length)
    svg.append("g")
        .attr("transform", "translate(0," + height_GW + ")")
        .attr('stroke', 'var(--color-dark2)')
        .call(d3.axisBottom(x).ticks(5));
    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width_GW / 2) + " ," +
            (height_GW + margin_GW.top + 60) + ")")
        .style("text-anchor", "middle")
        .text("Emissions (GIGATONS)");

    svg.append("g")
        .attr('stroke', 'var(--color-dark2)')
        .call(d3.axisLeft(y).ticks(3));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_GW.left - 5)
        .attr("x", 0 - (height_GW / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("TEMPERATURE (°C)");

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
        .range(["#f9aab7", "#ed8a9b", "#c95d6f", "#be1e3b", "#990823"])

    var hexbin = d3.hexbin()
        .radius(30) // size of the bin in px
        .extent([[0, 0], [width_GW, height_GW]])

    // Plot the hexbins
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width_GW)
        .attr("height", height_GW)

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("fill", d => color(d.length))
        .attr("stroke", "var(--color-light2)")
        .attr("stroke-width", "3")

}


/********************* SCROLL ****************/

function global_warming_scroll(position) {
    // console.log(position);
}