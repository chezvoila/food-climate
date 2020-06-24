
"use strict";

//**************** STATIC VARIABLES *****************//

// categories
const cereals = ["Wheat and products", "Rice and products", "Barley and products", "Maize and products",
    "Rye and products", "Oats", "Millet and products", "Sorghum and products", "Cereals, Other"];
const roots = ["Cassava and products", "Potatoes and products", "Sweet potatoes", "Yams", "Roots, Other"];
const sweeteners = ["Sugar cane", "Sugar beet", "Sugar non-centrifugal", "Sugar (Raw Equivalent)", "Sweeteners, Other"]
const pulses = ["Honey", "Beans", "Peas", "Pulses, Other and products"] // to change
const oilcrops = ["Nuts and products", "Soyabeans", "Groundnuts (Shelled Eq)", "Sunflower seed", "Rape and Mustardseed", "Cottonseed",
    "Coconut - Incl Copra", "Sesame Seed", "Palm kernels", "Olives (including preserved)", "Oilcrops, Other"];
const oils = ["Soyabean Oil", "Groundnut Oil", "Sunflowerseed Oil", "Rape and Mustard Oil", "Cottonseed Oil", "Palmkernel Oil", "Palm Oil",
    "Coconut Oil", "Sesameseed Oil", "Olive Oil", "Ricebran Oil", "Maize Germ oil", "Oilcrops Oil, Other"];
const vegetables = ["Tomatoes and products", "Onions", "Vegetables, Other"];
const fruits = ["Oranges, Mandarines", "Lemons, Limes and products", "Grapefruit and products", "Citrus,Others", "Bananas", "Plantains",
    "Apples and products", "Pineapples and products", "Dates", "Grapes and products (excl wine)", "Fruits, Other"];
const spices = ["Coffee and products", "Cacao Beans and products", "Tea (including mate)", "Pepper", "Pimento", "Cloves", "Spices, Other"];
const beverages = ["Wine", "Beer", "Beverages, Fermented", "Beverages, Alcoholic", "Alcohol, Non-Food"];
const meat = ["Bovine Meat", "Mutton & Goat Meat", "Pigmeat", "Poultry Meat", "Meat, Other", "Meat, Aquatic Mammals"];
const fish = ["Freshwater Fish", "Demersal Fish", "Pelagic Fish", "Marine Fish, Other", "Crustaceans", "Cephalopods", "Molluscs, Other"];
const others = ["Offals, Edible", "Butter, Ghee", "Cream", "Fats, Animals, Raw", "Fish, Body Oil", "Fish, Liver Oil", "Eggs",
    "Milk - Excluding Butter"];


const cat1 = {
    name: "Primary",
    columns: ["fruits", "vegetables", "cereals", "oilcrops"]
}
const cat2 = {
    name: "Animals",
    columns: ["meat", "fish"]
}
const cat3 = {
    name: "Extracted",
    columns: ["oils", "sweeteners"]
}
const cat4 = {
    name: "Other",
    columns: ["roots", "pulses", "spices", "others"]
}
// missing : beverages, because more drink than food

const cats = [cat1, cat2, cat3, cat4]

const text_before = "The food industry is a major actor in world's CO2 emissions and thus also responsible for global warming. The next \
question we want then to answer is who and why. To answer that we want to focus on people's diet. We collected data on each country \
habits of consumming. This shows, on average, how the country's habitants eat. We saw that each product doesn't emits the same amount of CO2,\
so depending on how they eat, the country will have its CO2 emissions impacted.\
In order to have a first impression on a chosen country habit of consumption, we show how much ressource of the Earth global population would need\
if every one on the planet was consuming as an average person of that country.";

const text_animation = "This division shows how people eat in a specific country.<br> The diet is here divided in four main categories. \
Hovering on a category will show what percentage of their diet is composed of that category and you will also have the details of what \
is contained inside that category."

/********************************/

// variables for code
let data_consumption, data_intake;
let lands_available;
let color;

let country;
let svg_world, svg_country;

const defaultArea = 100000;
let area_country;

const margin_chart_land = 10;
const height_division_land = 500;

function land(if_everyone, intake) {

    // get formatted data
    const data_land = get_data_land(if_everyone, intake);
    data_consumption = data_land.consumption;
    data_intake = data_land.intake;

    // Make a list of the countries that are in the 4 datasets
    lands_available = make_list_land(data_consumption, data_intake);
    lands_available.push("World")

    // create color function
    color = d3.scaleOrdinal(d3.schemePaired).range(['#ffffff', '#992437']); // TO DEFINE
    // update color domain
    land_color_domain(color, lands_available);

    // default display is Canada
    country = "Canada";
    // get areas
    area_country = getAreaCountry(defaultArea, data_consumption, country);
    // append (so first = true) and display the 2 charts
    svg_world = init_division_world(defaultArea, color, true);
    svg_country = init_division_country(area_country, color, true, country);
    // transitions on mouseover and mouseout
    d3.select("#land_charts")
        .on("click", _ => {
            chart_division_world(svg_world, data_intake, defaultArea);
            chart_division_country(svg_country, data_intake, defaultArea, country, color);
        })

    // Autocomplete for the search bar
    new autoComplete({
        selector: "#search-bar input",
        minChars: 1,
        source: function (term, suggest) {
            term = term.toLowerCase();
            var matches = [];
            lands_available.forEach(function (d) {
                if (~d.toLowerCase().indexOf(term)) {
                    matches.push(d);
                }
            });
            suggest(matches);
        },
        renderItem: function (item, search) {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-val="'
                + item + '">' + item.replace(re, "<b>$1</b>") + "</div>";
        },
        onSelect: function (e, term, item) {
            country = term;
            area_country = getAreaCountry(defaultArea, data_consumption, country);
            init_division_country(area_country, color, false, country, svg_country);
            init_division_world(defaultArea, color, false, svg_world);
            d3.select("#div_columns").classed('display', false)
        }
    });

}
/**
 * Create JS objects containing the data needed for the viz
 *
 * @param if_everyone       Data about how much Earth's would we need if everyone what consumming like a specific country
 * @param intake            Intake (kg/capita/year) for different types of food per country
 */
function get_data_land(if_everyone, intake) {

    var data_consumption = if_everyone.map(d => {
        return {
            key: d.Entity,
            Percentage: d.Percentage
        }
    })

    var getData = (key, data) => {
        var find = data.find(d => d.Item == key)
        return find ? find.Value : 0
    }

    var data_intake = d3.nest()
        .key(d => d.Area)
        .rollup(a => {
            return {
                cereals: {
                    details: cereals,
                    value: d3.sum(cereals.map(d => getData(d, a)))
                },
                roots: {
                    details: roots,
                    value: d3.sum(roots.map(d => getData(d, a)))
                },
                sweeteners: {
                    details: sweeteners,
                    value: d3.sum(sweeteners.map(d => getData(d, a)))
                },
                pulses: {
                    details: pulses,
                    value: d3.sum(pulses.map(d => getData(d, a)))
                },
                oilcrops: {
                    details: oilcrops,
                    value: d3.sum(oilcrops.map(d => getData(d, a)))
                },
                oils: {
                    details: oils,
                    value: d3.sum(oils.map(d => getData(d, a)))
                },
                vegetables: {
                    details: vegetables,
                    value: d3.sum(vegetables.map(d => getData(d, a)))
                },
                fruits: {
                    details: fruits,
                    value: d3.sum(fruits.map(d => getData(d, a)))
                },
                spices: {
                    details: spices,
                    value: d3.sum(spices.map(d => getData(d, a)))
                },
                beverages: {
                    details: beverages,
                    value: d3.sum(beverages.map(d => getData(d, a)))
                },
                meat: {
                    details: meat,
                    value: d3.sum(meat.map(d => getData(d, a)))
                },
                fish: {
                    details: fish,
                    value: d3.sum(fish.map(d => getData(d, a)))
                },
                others: {
                    details: others,
                    value: d3.sum(others.map(d => getData(d, a)))
                }
            }
        })
        .entries(intake)
    return {
        consumption: data_consumption,
        intake: data_intake
    }
}

/**
 * Make a list of all the countries having data in the four datasets
 *
 * @param data_consumption       Data about how much Earth's would we need if everyone what consumming like a specific country
 * @param data_intake            Intake (kg/capita/year) for different types of food per country
 */
function make_list_land(data_consumption, data_intake) {
    var sets = [data_consumption, data_intake];
    var min_length = d3.min(sets.map(d => d.length));
    var short_set = sets.filter(d => d.length == min_length)[0];

    var list = [];
    short_set.forEach(element => {
        var name = element.key;
        var presence = true;
        sets.forEach(set => {
            if (set.find(d => d.key == name) === undefined)
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

function getAreaCountry(defaultArea, data_consumption, country) {
    var element = data_consumption.find(d => d.key == country);
    var scale = element.Percentage / 100;
    // update text display
    d3.select("#country").text(country);
    d3.select("#value").text(scale.toFixed(2));
    return defaultArea * scale;
}


/**
 * Displays 4 rects elements forming a big rectangle to show the surface of the world
 *
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param color             Color function
 * @param first             Notifies if we have to add the svg, or if it is just an update
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_world(init_area, color, first, svg) {

    // append the svg if it is the first time that the function is called
    if (first) {
        svg = d3.select("#land #rightDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ?
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect') :
        svg.selectAll('rect')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
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
 * @param country           Name of the country
 * @param svg               Svg containing the squares. Will only be specified when first = false
 */
function init_division_country(init_area, color, first, country, svg) {

    // append the svg if it is the first time that the function is called
    if (first) {
        svg = d3.select("#land #leftDivision")
            .append('svg')
            .attr('height', height_division_land);
    }

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    var rects = first ?
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect') :
        svg.selectAll('rect')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
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
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaCountry
 */
function chart_division_world(svg, data_intake, init_area) {

    var mean_data = {
        cereals: { details: cereals, value: d3.mean(data_intake.map(d => d.value.cereals.value)) },
        roots: { details: roots, value: d3.mean(data_intake.map(d => d.value.roots.value)) },
        sweeteners: { details: sweeteners, value: d3.mean(data_intake.map(d => d.value.sweeteners.value)) },
        pulses: { details: pulses, value: d3.mean(data_intake.map(d => d.value.pulses.value)) },
        oilcrops: { details: oilcrops, value: d3.mean(data_intake.map(d => d.value.oilcrops.value)) },
        oils: { details: oils, value: d3.mean(data_intake.map(d => d.value.oils.value)) },
        vegetables: { details: vegetables, value: d3.mean(data_intake.map(d => d.value.vegetables.value)) },
        fruits: { details: fruits, value: d3.mean(data_intake.map(d => d.value.fruits.value)) },
        spices: { details: spices, value: d3.mean(data_intake.map(d => d.value.spices.value)) },
        beverages: { details: beverages, value: d3.mean(data_intake.map(d => d.value.beverages.value)) },
        meat: { details: meat, value: d3.mean(data_intake.map(d => d.value.meat.value)) },
        fish: { details: fish, value: d3.mean(data_intake.map(d => d.value.fish.value)) },
        others: { details: others, value: d3.mean(data_intake.map(d => d.value.others.value)) }
    }

    var categories = [{}, {}, {}, {}];

    var s = 0;
    // get the sum of the values of each category
    cats.forEach((cat, i) => {
        var value = d3.sum(cat.columns.map(d => mean_data[d].value));
        var all_cat = cat.columns.map(d => mean_data[d].details)
        all_cat = [].concat.apply([], all_cat);
        categories[i].value = value;
        categories[i].details = all_cat;

        s += value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    // add rects
    svg.selectAll('rect')
        .on('mouseover', (d, i) => {
            var value = categories[i].value;
            var details = categories[i].details;
            var columns = cats[i].columns;
            display_columns(value, details, columns, "World")
        })
        .data(categories)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value))
        .attr('height', d => Math.sqrt(init_area * d.value))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
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
        });

    // add titles
    svg.selectAll('text')
        .data(cats)
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
        .style("font-size", (d, i) => 10 + categories[i].value * 40)
        .text(d => d.name);
}


/**
 * Tranisition into display of 4 squares representing the proportion of land used for different types of element
 *
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param country           Name of the country
 * @param color             Color function
 */
function chart_division_country(svg, data_intake, init_area, country, color) {

    var element = data_intake.find(d => d.key == country);

    var categories = [{}, {}, {}, {}];

    var s = 0;
    // get the sum of the values of each category
    cats.forEach((cat, i) => {
        var value = d3.sum(cat.columns.map(d => element.value[d].value));
        var all_cat = cat.columns.map(d => element.value[d].details)
        all_cat = [].concat.apply([], all_cat);
        categories[i].value = value;
        categories[i].details = all_cat;

        s += value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    // add rects
    svg.selectAll('rect')
        .on('mouseover', (d, i) => {
            var value = categories[i].value;
            var details = categories[i].details;
            var columns = cats[i].columns;
            display_columns(value, details, columns, country)
        })
        .data(categories)
        .transition()
        .duration(500)
        .attr('width', d => Math.sqrt(init_area * d.value))
        .attr('height', d => Math.sqrt(init_area * d.value))
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
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

    // add numbers
    svg.selectAll('text.numbers')
        .data(categories)
        .enter()
        .append('text')
        .classed('numbers', true)
        .classed('anchor_middle', true)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area);
            var vert_align = d.value * 20;
            switch (i) {
                case 0:
                    left = - (size / 2 + margin_chart_land);
                    top = - (size / 2 + margin_chart_land) + vert_align;
                    break;
                case 1:
                    left = size / 2 + margin_chart_land;
                    top = - (size / 2 + margin_chart_land) + vert_align;
                    break;
                case 2:
                    left = size / 2 + margin_chart_land;
                    top = size / 2 + margin_chart_land + vert_align;
                    break;
                case 3:
                    left = - (size / 2 + margin_chart_land);
                    top = size / 2 + margin_chart_land + vert_align;
                    break;
            }
            return `translate(${left},${top})`;
        })
        .style("font-size", d => 20 + d.value * 80)
        .text(d => (d.value * 100).toFixed(2))


    // add titles
    svg.selectAll('text.titles')
        .data(cats)
        .enter()
        .append('text')
        .attr('x', '50%')
        .attr('y', '50%')
        .classed('titles', true)
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
        .style("font-size", (d, i) => 10 + categories[i].value * 40)
        .text(d => d.name);
}


// display the percentages and what is composed the hovered area
function display_columns(value, details, columns, country) {
    var g = d3.select("#div_columns");

    g.select("#columns_country").text(country);
    var perc = value * 100;
    g.select("#columns_percentage").text(perc.toFixed(2));
    var html = "";
    columns.forEach(d => {
        html += d + "<br>"
    })
    g.select("#columns").html(html);
    g.classed("display", true)

    display_details(details)
}

// display everything that is composing a category
function display_details(array) {
    var html = "Detailed composition of the category : <br><br>"
    html += "|"
    array.forEach(d => {
        html += "| " + d + " |"
    })
    html += "|"
    d3.select("#details").html(html)
}

// empties the details div and undisplays the text that is between the charts
function reset() {
    d3.select("#details").html('');
    d3.select("#div_columns").classed("display", false);
}


/********************* SCROLL ****************/

var transition_completed = false;
var scroll_trigger = 550;
function land_scroll(position) {
    if (position < scroll_trigger && transition_completed) {
        init_division_world(defaultArea, color, false, svg_world);
        init_division_country(area_country, color, false, country, svg_country);
        reset();
        transition_completed = false;
    }
    if (position > scroll_trigger && !transition_completed) {
        d3.select("#details").html(text_animation);
        chart_division_world(svg_world, data_intake, defaultArea);
        chart_division_country(svg_country, data_intake, defaultArea, country, color);
        transition_completed = true;
    }
}