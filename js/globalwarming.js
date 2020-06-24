
"use strict";

/****************** STATIC VARIABLES ******************/
let text_GW_1 = "As shown in the previous section, each type of food releases a different amount of CO2.\
                 But why is it important to monitor the CO2 emissions ? The reason is that CO2 emissions\
                 directly affect the temperature on earth and therefore contributes to climate changes.\
                 <br/><br/>Data on the average temperature at the earth surface and the amount of CO2 emissions\
                 released were collected each year from 1961 to 2015.\
                 <br/><br/>Each dot represents a single year.",
                //"Data for different years of how much CO2 emissions were made and what was the average temperature at the surface of the world",
    text_GW_2 = "The interest here is to view the relation between the temperature and the amount of CO2 released.\
                 For this reason, the dots are grouped into zones of equal size to ease the view of the trend.",
    text_GW_3 = "Each zone is now colored based on the density of dots in each zone. The more points there is in\
                 a zone, the more saturation this zone has.",
    text_GW_4 = "As we can see, there is a trend showing that more CO2 emissions tends to rise the temperature on the\
                 surface of the earth. This is due to the increasing human activities such as electricity production,\
                 industries, heating, transportation and of course the food industry.";


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

    d3.select("#global_warming").append('p').html(text_GW_1)
    d3.select("#global_warming").append('p').html(text_GW_2)
    d3.select("#global_warming").append('p').html(text_GW_3)
    d3.select("#global_warming").append('p').html(text_GW_4)
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
        .classed("sticky", true)
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

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.emission); })
        .attr("cy", function (d) { return y(d.temperature); })
        .attr("r", 3)
        .style("fill", "var(--color-dark2")

}

function hexa_black(svg, data, x, y) {

    // from https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
    var inputForHexbinFun = []
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.emission), y(d.temperature)])  // Note that we had the transform value of X and Y !
    })

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
        .attr('id', 'hexa_g')
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("fill", "transparent")
        .attr("stroke", "var(--color-dark3)")
        .attr("stroke-width", "1")
        .attr("opacity", 0)
        .transition()
        .duration(200)
        .delay((d, i) => i * 25)
        .attr("opacity", 1)

}

function hexa(svg, data, x, y) {

    svg.selectAll('circle').remove()

    // from https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
    var inputForHexbinFun = []
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.emission), y(d.temperature)])  // Note that we had the transform value of X and Y !
    })

    var color = d3.scaleOrdinal()
        .domain([0, 6])
        .range(["#f9aab7", "#ed8a9b", "#c95d6f", "#be1e3b", "#990823"])

    var hexbin = d3.hexbin()
        .radius(30) // size of the bin in px
        .extent([[0, 0], [width_GW, height_GW]])

    svg.select("#hexa_g")
        .selectAll("path")
        .data(hexbin(inputForHexbinFun))
        .transition()
        .duration(200)
        .delay((d, i) => i * 25)
        .attr("fill", d => color(d.length))
        .attr("stroke", "var(--color-light2)")
        .attr("stroke-width", "3")

}


/********************* SCROLL ****************/

var transition_GW = false;
var transition2_GW = false;
function global_warming_scroll(position) {
    console.log(position);
    if (position > 1000 && !transition_GW) {
        hexa_black(svg_GW, data_GW, x_GW, y_GW)
        transition_GW = true
    }
    if (position > 1400 && !transition2_GW) {
        hexa(svg_GW, data_GW, x_GW, y_GW)
        transition2_GW = true
    }
}