/**
 * Create JS objects containing the data needed for the viz
 *
 * @param area_world        Data about the surface of each country
 * @param arable            Percentage of each country's surface used for arable agriculture
 * @param mead_past         Percentage of each country's surface used for meadows and pastures
 * @param agriculture       Percentage of each country's surface used for agriculture
 */
function land(area_world, arable, mead_past, agriculture) {

    // year of the shown data
    const year_chosen = 2015;

    /***** processing data *****/

    var data_area_world = area_world.map(d => {
        return {
            Entity: d["Country Name"],
            surface: d[year_chosen]
        }
    })

    // The share of land area used for agriculture, measured as a percentage of total land area. 
    // Agricultural land refers to the share of land area that is arable, under permanent crops, and under permanent pastures.
    var data_agriculture = d3.nest()
        .key(d => d.Year)
        .entries(agriculture)
        .filter(d => d.key == year_chosen)

    // The share of land area used for arable agriculture, measured as a percentage of total land area. Arable land includes
    // land defined by the FAO as land under temporary crops (double-cropped areas are counted once), temporary meadows
    // for mowing or for pasture, land under market or kitchen gardens, and land temporarily fallow.
    var data_arable = d3.nest()
        .key(d => d.Year)
        .entries(arable)
        .filter(d => d.key == year_chosen)

    // Permanent meadows and pastures is defined by the FAO as: "the land used permanently (five years or more) to grow
    // herbaceous forage crops, either cultivated or growing wild (wild prairie or grazing land)."
    var data_mead_past = d3.nest()
        .key(d => d.Year)
        .entries(mead_past)
        .filter(d => d.key == year_chosen)

    return {
        world: data_area_world,
        agriculture: data_agriculture[0].values,
        arable: data_arable[0].values,
        mead_past: data_mead_past[0].values
    }
}

/**
 * Make a list of all the countries having data in the four datasets
 *
 * @param data_world            Data about the surface of each country
 * @param data_agriculture      Percentage of each country's surface used for agriculture
 * @param data_arable           Percentage of each country's surface used for arable agriculture
 * @param data_mead_past        Percentage of each country's surface used for meadows and pastures
 */
function make_list_land(data_world, data_agriculture, data_arable, data_mead_past) {
    var sets = [data_world, data_agriculture, data_arable, data_mead_past];
    var min_length = d3.min(sets.map(d => d.length));
    var short_set = sets.filter(d => d.length == min_length)[0];

    var list = [];
    short_set.forEach(element => {
        var name = element.Entity;
        var presence = true;
        sets.forEach(set => {
            if (set.find(d => d.Entity == name) === undefined)
                presence = false;
        })
        if (presence)
            list.push(name)
    });
    return list;
}

function land_color_domain(color, data) {
    color.domain(data)
}

// for the world, 1px² is 500km²
const scale_land_world = 1 / 500;

function getAreaWorld(data_surface) {
    var world = data_surface.find(d => d.Entity == "World");
    return world.surface * scale_land_world;
}

// for a country, 1px² is 100km²
const scale_land_country = 100;

function getMeanArea(data_surface) {
    var mean = d3.mean(data_surface.map(d => d.surface));
    return mean / scale_land_country;
}
function getAreaCountry(data_surface, country) {
    var element = data_surface.find(d => d.Entity == country);
    var init_area = element.surface;

    console.log(init_area)
    var scale = 1;
    // area_world = 132048793
    if (init_area < 25000)
        scale = 4
    else if (init_area < 50000)
        scale = 2

    d3.select("#scale").text(scale_land_country * scale)
    return init_area * scale / scale_land_country;
}

var avg_agriculture = { name: "Agriculture" };
var avg_arable = { name: "Arable" };
var avg_mead_past = { name: "Meadows and Pastures" };
var rest = { name: "Other" };

const margin_chart_land = 10;
const height_division_land = 700;


/**
 * Displays 4 rects elements forming a big rectangle to show the surface of the world
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_world(init_area, color, first, svg) {

    if (first) {
        svg = d3.select("#land #rightDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ? svg.selectAll('rect').data(data).enter().append('rect') : svg.selectAll('rect').data(data).transition().duration(500);
    rects.attr('width', size)
        .attr('height', size)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top;
            switch (i) {
                case 0:
                    left = - size;
                    top = - size;
                    break;
                case 1:
                    left = 0;
                    top = - size;
                    break;
                case 2:
                    left = 0;
                    top = 0;
                    break;
                case 3:
                    left = - size;
                    top = 0;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .attr('fill', color("World"));

    svg.selectAll('text')
        .remove()

    return svg;
}

/**
 * Displays 4 rects elements forming a big rectangle to show the surface of the world
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_country(init_area, color, first, svg, country) {

    if (first) {
        svg = d3.select("#land #leftDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ? svg.selectAll('rect').data(data).enter().append('rect') : svg.selectAll('rect').data(data).transition().duration(500);
    rects.attr('width', size)
        .attr('height', size)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top;
            switch (i) {
                case 0:
                    left = - size;
                    top = - size;
                    break;
                case 1:
                    left = 0;
                    top = - size;
                    break;
                case 2:
                    left = 0;
                    top = 0;
                    break;
                case 3:
                    left = - size;
                    top = 0;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .attr('fill', color(country));

    svg.selectAll('text')
        .remove()

    return svg;
}

/**
 * Displays 4 rects elements forming a big rectangle to show the surface of a country
 *
 * @param init_area         Area value of the world coming from getAreaCountry
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function chart_division_world(svg, data_agriculture, data_arable, data_mead_past, init_area, color) {

    avg_agriculture.value = d3.mean(data_agriculture.map(d => d.land_area_perc));
    avg_arable.value = d3.mean(data_arable.map(d => d.percentage_land_area));
    avg_mead_past.value = d3.mean(data_mead_past.map(d => d.land_use_perc));
    rest.value = 100 - (d3.sum([avg_agriculture, avg_arable, avg_mead_past].map(d => d.value)));

    var avgs = [avg_agriculture, avg_arable, avg_mead_past, rest];

    svg.selectAll('rect')
        .data(avgs)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value / 100))
        .attr('height', d => Math.sqrt(init_area * d.value / 100))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value / 100;
            var size = Math.sqrt(area)
            switch (i) {
                case 0:
                    left = - (size + margin_chart_land);
                    top = - (size + margin_chart_land);
                    break;
                case 1:
                    left = margin_chart_land;
                    top = - (size + margin_chart_land);
                    break;
                case 2:
                    left = margin_chart_land;
                    top = margin_chart_land;
                    break;
                case 3:
                    left = - (margin_chart_land + size);
                    top = margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        })

    svg.selectAll('text')
        .data(avgs)
        .enter()
        .append('text')
        .attr('x', '50%')
        .attr('y', '50%')
        .classed('anchor_left', (d, i) => i == 0 || i == 3)
        .attr('transform', (d, i) => {
            var left, top;
            switch (i) {
                case 0:
                    left = - 2 * margin_chart_land;
                    top = - 2 * margin_chart_land;
                    break;
                case 1:
                    left = 2 * margin_chart_land;
                    top = - 2 * margin_chart_land;
                    break;
                case 2:
                    left = 2 * margin_chart_land;
                    top = 3 * margin_chart_land;
                    break;
                case 3:
                    left = - 2 * margin_chart_land;
                    top = 3 * margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .text(d => d.name);
}

/**
 * Tranisition into display of 4 squares representing the proportion of land used for different types of element
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function chart_division_country(svg, data_agriculture, data_arable, data_mead_past, init_area, country, color) {

    var ag = data_agriculture.find(d => d.Entity == country);
    avg_agriculture.value = parseFloat(ag.land_area_perc);
    var ar = data_arable.find(d => d.Entity == country);
    avg_arable.value = parseFloat(ar.percentage_land_area);
    var mp = data_mead_past.find(d => d.Entity == country);
    avg_mead_past.value = parseFloat(mp.land_use_perc);
    rest.value = 100 - (d3.sum([avg_agriculture, avg_arable, avg_mead_past].map(d => d.value)));

    if (rest.value < 0) // glitch with percentages
        rest.value = 0 // don't show rest
    var avgs = [avg_agriculture, avg_arable, avg_mead_past, rest];

    svg.selectAll('rect')
        .data(avgs)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value / 100))
        .attr('height', d => Math.sqrt(init_area * d.value / 100))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value / 100;
            var size = Math.sqrt(area)
            switch (i) {
                case 0:
                    left = - (size + margin_chart_land);
                    top = - (size + margin_chart_land);
                    break;
                case 1:
                    left = margin_chart_land;
                    top = - (size + margin_chart_land);
                    break;
                case 2:
                    left = margin_chart_land;
                    top = margin_chart_land;
                    break;
                case 3:
                    left = - (margin_chart_land + size);
                    top = margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .attr('fill', color(country));

    svg.selectAll('text')
        .data(avgs)
        .enter()
        .append('text')
        .attr('x', '50%')
        .attr('y', '50%')
        .classed('anchor_left', (d, i) => i == 0 || i == 3)
        .attr('transform', (d, i) => {
            var left, top;
            switch (i) {
                case 0:
                    left = - 2 * margin_chart_land;
                    top = - 2 * margin_chart_land;
                    break;
                case 1:
                    left = 2 * margin_chart_land;
                    top = - 2 * margin_chart_land;
                    break;
                case 2:
                    left = 2 * margin_chart_land;
                    top = 3 * margin_chart_land;
                    break;
                case 3:
                    left = - 2 * margin_chart_land;
                    top = 3 * margin_chart_land;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .text(d => d.name);
}