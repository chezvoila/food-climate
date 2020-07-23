
"use strict";

/****************** STATIC VARIABLES ******************/
let text_GW_1 = "As shown in the previous section, each type of food releases a different amount of CO₂.\
                But why is it important to monitor CO₂ emissions? The reason is that CO₂ emissions \
                directly affect the temperature on earth and therefore contribute to climate changes.\
                 <br/><br/>Here is the average temperature at the Earth's surface and the amount of CO₂ \
                 emissions released for the years 1961 to 2015\
                 <br/><br/>Each dot represents a single year.",
    text_GW_2 = "The interest here is to see the relationship between temperature and the amount of CO₂ released, \
    so the dots are grouped into zones of equal size to make the trend obvious.",
    text_GW_3 = "Each zone is now colored based on the density of dots in each zone. The more points there is in\
                 a zone, the more saturation this zone has.",
    text_GW_4 = "As we can see, there is a trend showing that more CO₂ emissions correlates with higher \
    surface temperatures on Earth. This is due to the increasing human \
    activities such as electricity production, industries, heating, transportation and <b>of course the food industry</b>.";


let data_GW;

let elements;
let svg_GW,
    x_GW,
    y_GW;

/**
 * base function to initialize this visualization
 *
 * @param data_emissions       dataset about co2 emissions
 * @param data_temperatures    dataset about temperatures 
 *
 */
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

    d3.select("#global_warming .container").append('p').html(text_GW_1)
    d3.select("#global_warming .container").append('p').html(text_GW_2)
    d3.select("#global_warming .container").append('p').html(text_GW_3)
    d3.select("#global_warming .container").append('p').html(text_GW_4)
}

/**
 * Data preprocessing for this vizualization.
 *
 * @param data_emissions       dataset about co2 emissions
 * @param data_temperatures    dataset about temperatures 
 *
 */
function get_data_GW(data_emissions, data_temperatures) {

    /***** processing data *****/

    const emissions = d3.nest()
        // arrange per year
        .key(d => d.Year)
        // sum all the emissions (GigaGrams)
        .rollup(a => d3.sum(a.map(d => d.Value)))
        .entries(data_emissions);

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

    return data
}

/**
 * Define the x domain for the chart based on the data
 *
 * @param x           the x axis
 * @param data        processed data
 *
 */
function xDomain_GW(x, data) {
    const emission = data.map(d => d.emission);
    x.domain([d3.min(emission), d3.max(emission)])
}

/**
 * Define the y domain for the chart based on the data
 *
 * @param y           the y axis
 * @param data        processed data
 *
 */
function yDomain_GW(y, data) {
    const temperature = data.map(d => d.temperature);
    y.domain([d3.min(temperature), d3.max(temperature)])
}


var margin_GW = { top: 0, right: 50, bottom: 30, left: 50 },
    width_GW = 600 - margin_GW.left - margin_GW.right,
    height_GW = 500 - margin_GW.top - margin_GW.bottom,
    text_height_GW = 20;


/**
 * Create the svg element and the scale needed to display
 * the hexabin density scatter plot chart.
 */
function create_GW() {

    // append the svg object to the body of the page
    var svg = d3.select("#global_warming .container")
        .append("svg")
        .classed("sticky", true)
        .attr("viewBox", `0 0 ${width_GW + margin_GW.left + margin_GW.right} ${height_GW + margin_GW.top + margin_GW.bottom + text_height_GW + 30}`)
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

/**
 * Draws the chart elements such as text
 *
 * @param svg         the svg element to draw in
 * @param x           the x axis
 * @param y           the y axis
 * @param data        processed data
 * @param first       is the elements already appended
 *
 */
function chart_GW(svg, x, y, data, first = true) {
    if (first) {
        svg.append("g")
            .attr("transform", "translate(0," + height_GW + ")")
            .attr('stroke', 'var(--color-dark2)')
            .call(d3.axisBottom(x).ticks(5));

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width_GW / 2) + " ," +
                (height_GW + margin_GW.top + 50) + ")")
            .style("text-anchor", "middle")
            .text("EMISSIONS (GIGATONS)");

        svg.append("g")
            .attr('stroke', 'var(--color-dark2)')
            .call(d3.axisLeft(y).ticks(3));

        // text label for the y axis
        svg.append("text")
            .attr("y", 0 - margin_GW.top)
            .attr("x", 5)
            .attr("dy", "1em")
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
    else {
        svg.select("#hexa_g")
            .selectAll("path")
            .transition()
            .duration(100)
            .delay((d, i) => i * 25)
            .attr('opacity', 0)
    }

}

/**
 * Draws the contour of the hexabins
 *
 * @param svg         the svg element to draw in
 * @param data        processed data
 * @param x           the x axis
 * @param y           the y axis
 * @param first       is the elements already appended
 *
 */
function hexa_black(svg, data, x, y, back, first = false) {

    // from https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
    var inputForHexbinFun = []
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.emission), y(d.temperature)])  // Note that we had the transform value of X and Y !
    })

    var hexbin = d3.hexbin()
        .radius(30) // size of the bin in px
        .extent([[0, 0], [width_GW, height_GW]]);

    if (first) {
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
        return
    }


    if (back) {
        svg.selectAll('circle')
            .transition()
            .duration(50)
            .delay((d, i) => i * 20)
            .attr('opacity', 1)
    }
    svg.select("#hexa_g")
        .selectAll("path")
        .transition()
        .duration(200)
        .delay((d, i) => i * 25)
        .attr("fill", "transparent")
        .attr("stroke", "var(--color-dark3)")
        .attr("stroke-width", 1)
        .attr('opacity', 1)

}

/**
 * Draws the filled hexa bins in the chart
 *
 * @param svg         the svg element to draw in
 * @param data        processed data
 * @param x           the x axis
 * @param y           the y axis
 *
 */
function hexa(svg, data, x, y) {

    svg.selectAll('circle')
        .transition()
        .duration(50)
        .delay((d, i) => i * 10)
        .attr('opacity', 0)

    // from https://www.d3-graph-gallery.com/graph/density2d_hexbin.html
    var inputForHexbinFun = []
    data.forEach(function (d) {
        inputForHexbinFun.push([x(d.emission), y(d.temperature)])  // Note that we had the transform value of X and Y !
    })

    var color = d3.scaleOrdinal()
        .domain([0, 6])
        .range(["#bd1a37", "#f9aab7", "#e2647a", "#ed8a9b", "#900b23"]);
        //  3(249, 170, 183)  nothing  2(201, 93, 109)1(190, 30, 59)4(153, 8, 35)
        //.range(["#f9aab7", "#ed8a9b", "#c95d6f", "#be1e3b", "#990823"]);

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
        .attr("stroke-width", 3)

}


/**
 * Triggers the animation depending on the position of 
 * the scroll in the section.
 *
 * @param position      Current position of the scrolling in the section
 *
 */
var transition_GW = false, transition2_GW = false;
var first = true;
function global_warming_scroll(position) {
    if (position > 1600 && !transition_GW) {
        hexa_black(svg_GW, data_GW, x_GW, y_GW, transition_GW, first)
        transition_GW = true;
        first = false;
    }
    if (position > 2100 && !transition2_GW) {
        hexa(svg_GW, data_GW, x_GW, y_GW)
        transition2_GW = true
    }
    if (position < 2100 && transition2_GW) {
        hexa_black(svg_GW, data_GW, x_GW, y_GW, transition2_GW)
        transition2_GW = false;
    }

    if (position < 1600 && transition_GW) {
        chart_GW(svg_GW, x_GW, y_GW, data_GW, false);
        transition_GW = false;
    }
}