function land(world, arable, mead_past, agriculture) {

    // year of the shown data
    const year_chosen = 2015;

    /***** processing data *****/

    var data_world = world.map(d => {
        return {
            Entity: d["Country Name"],
            surface: d[year_chosen]
        }
    })
    // console.log(data_world)


    // The share of land area used for agriculture, measured as a percentage of total land area. 
    // Agricultural land refers to the share of land area that is arable, under permanent crops, and under permanent pastures.
    var data_agriculture = d3.nest()
        .key(d => d.Year)
        .entries(agriculture)
        .filter(d => d.key == year_chosen)
    // console.log(data_agriculture)

    // The share of land area used for arable agriculture, measured as a percentage of total land area. Arable land includes
    // land defined by the FAO as land under temporary crops (double-cropped areas are counted once), temporary meadows
    // for mowing or for pasture, land under market or kitchen gardens, and land temporarily fallow.
    var data_arable = d3.nest()
        .key(d => d.Year)
        .entries(arable)
        .filter(d => d.key == year_chosen)
    // console.log(data_arable)

    // Permanent meadows and pastures is defined by the FAO as: "the land used permanently (five years or more) to grow
    // herbaceous forage crops, either cultivated or growing wild (wild prairie or grazing land)."
    var data_mead_past = d3.nest()
        .key(d => d.Year)
        .entries(mead_past)
        .filter(d => d.key == year_chosen)
    // console.log(data_mead_past)

    return {
        world: data_world,
        agriculture: data_agriculture[0].values,
        arable: data_arable[0].values,
        mead_past: data_mead_past[0].values
    }
}

// MAKING A LIST OF ALL THE COUNTRIES HAVING DATA IN THE FOUR DATASETS

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

// COLOR DOMAIN

function land_color_domain(color, data) {
    color.domain(data.map(d => d.Entity))
}

var height_land = 550;

// SQUARE FOR SURFACE OF THE EARTH ON THE RIGHT
const scale_land_world = 1 / 500;

function chart_land_world(data_surface, color) {

    // var svg = d3.select("#land #rightTotal")
    //     .append('svg')
    //     .attr('height', height_land);

    var world = data_surface.find(d => d.Entity == "World");
    var area_world = world.surface * scale_land_world;
    var size_world = Math.sqrt(area_world); // length of one side
    // console.log(size_world);

    // svg.append('rect')
    //     .attr('id', 'rect_world')
    //     .attr('width', size_world)
    //     .attr('height', size_world)
    //     .attr('x', '50%')
    //     .attr('y', '50%')
    //     .attr('transform', `translate(${-size_world / 2},${-size_world / 2})`)
    //     .attr('fill', color("World"));

    return area_world;
}

// SQUARE FOR SURFACE OF A COUNTRY ON THE LEFT
const scale_land_country = 1 / 100;

function mean_land_country(data_surface) {
    // var svg = d3.select("#land #leftTotal")
    //     .append('svg')
    //     .attr('height', height_land);

    var mean = d3.mean(data_surface.map(d => d.surface));
    var mean_area = mean * scale_land_country;
    var mean_size = Math.sqrt(mean_area); // length of one side

    // svg.append('rect')
    //     .attr('id', 'rect_country')
    //     .attr('width', mean_size)
    //     .attr('height', mean_size)
    //     .attr('x', '50%')
    //     .attr('y', '50%')
    //     .attr('transform', `translate(${-mean_size / 2},${-mean_size / 2})`)
    //     .attr('fill', 'grey');

    return mean_area;
}

function chart_land_country(data_surface, color, country) {

    var element = data_surface.find(d => d.Entity == country);
    var area = element.surface * scale_land_country;
    var size = Math.sqrt(area); // length of one side
    // console.log(size);

    // d3.select('#rect_country')
    //     .transition()
    //     .duration(500)
    //     .attr('width', size)
    //     .attr('height', size)
    //     .attr('transform', `translate(${-size / 2},${-size / 2})`)
    //     .attr('fill', color(country));

    return area;

}

var avg_agriculture = { name: "Agriculture" };
var avg_arable = { name: "Arable" };
var avg_mead_past = { name: "Meadows and Pastures" };
var rest = { name: "Other" };

const margin_chart_land = 10;
const height_division_land = 700;


// FIRST notifies if we have to create the svg or if it is an mouseout transition
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

    return svg;
}

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

    return svg;
}


function chart_division_world(svg, data_agriculture, data_arable, data_mead_past, init_area, color) {

    avg_agriculture.value = d3.mean(data_agriculture.map(d => d.land_area_perc));
    avg_arable.value = d3.mean(data_arable.map(d => d.percentage_land_area));
    avg_mead_past.value = d3.mean(data_mead_past.map(d => d.land_use_perc));
    rest.value = 100 - (d3.sum([avg_agriculture, avg_arable, avg_mead_past].map(d => d.value)));

    var avgs = [avg_agriculture, avg_arable, avg_mead_past, rest];
    avgs = avgs.sort((a, b) => b.value - a.value)

    var biggest_area = init_area * avgs[0].value / 100;
    var biggest_size = Math.sqrt(biggest_area);

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
                    left = - (biggest_size + margin_chart_land);
                    top = - (biggest_size + margin_chart_land);
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
}

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
    avgs = avgs.sort((a, b) => b.value - a.value)

    console.log(avgs)
    var biggest_area = init_area * avgs[0].value / 100;
    var biggest_size = Math.sqrt(biggest_area);

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
                    left = - (biggest_size + margin_chart_land);
                    top = - (biggest_size + margin_chart_land);
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

    // svg.selectAll('text')
    //     .data(avgs)
    //     .enter()
    //     .append('text')
    //     .attr('transform', (d, i) => {
    //         var left = margin_chart_land,
    //             top = biggest_size - margin_chart_land,
    //             area = init_area * d.value / 100;
    //         var size = Math.sqrt(area)
    //         switch (i) {
    //             case 1:
    //                 left = biggest_size + 2 * margin_chart_land;
    //                 top = biggest_size - margin_chart_land;
    //                 break;
    //             case 2:
    //                 left = biggest_size + 2 * margin_chart_land;
    //                 top = biggest_size + +size;
    //                 break;
    //             case 3:
    //                 left = biggest_size - size + margin_chart_land;
    //                 top = biggest_size + size;
    //                 break;
    //         }
    //         return `translate(${left},${top})`;
    //     })
    //     .text(d => d.name);
}