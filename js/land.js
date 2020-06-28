
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
    img: "icon_vegetables",
    columns: ["fruits", "vegetables", "cereals", "oilcrops"]
}
const cat2 = {
    name: "Animals",
    img: "icon_livestock",
    columns: ["meat", "fish"]
}
const cat3 = {
    name: "Extracted",
    img: "oil",
    columns: ["oils", "sweeteners"]
}
const cat4 = {
    name: "Other",
    img: "icon_spices",
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
// let color;

let country;
let svg_world, svg_country;

let main_svg;

const defaultArea = 90000;
let area_country;

let world_sizes = [0, 0, 0, 0]
let country_sizes = [0, 0, 0, 0]

const margin_chart_land = 10;
const height_division_land = 600;

function land(if_everyone, intake) {

    // get formatted data
    const data_land = get_data_land(if_everyone, intake);
    data_consumption = data_land.consumption;
    data_intake = data_land.intake;

    // Make a list of the countries that are in the 4 datasets
    lands_available = make_list_land(data_consumption, data_intake);

    // default display is Canada
    country = "Canada";
    // get areas
    area_country = getAreaCountry(defaultArea, data_consumption, country);

    // create svg
    main_svg = init_main_svg();
    // add rects for world and country (first = true)
    init_division_world(defaultArea, main_svg, true)
    init_division_country(area_country, main_svg, true)
    // put the right square in front
    update_level_main(area_country, main_svg)


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
            return '<div title="' + item + '" class="autocomplete-suggestion" data-val="'
                + item + '">' + item.replace(re, "<b>$1</b>") + "</div>";
        },
        onSelect: function (e, term, item) {
            country = term;
            transition_completed = false; // to divide on scroll again
            area_country = getAreaCountry(defaultArea, data_consumption, country);
            // form the initial square again
            init_division_country(area_country, main_svg);
            init_division_world(defaultArea, main_svg);
            update_level_main(area_country, main_svg);
            // empties the text sections
            reset();
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


// Get the area size to display for a specific country
// also updates the text elements with the right country name
function getAreaCountry(defaultArea, data_consumption, country) {
    var element = data_consumption.find(d => d.key == country);
    var scale = element.Percentage / 100;
    // update text display
    d3.select("#country").text(country);
    d3.select("#countryTitle").html(country);
    d3.select("#country_legend").html(country);
    d3.select("#value").text(scale.toFixed(2));
    return defaultArea * scale;
}

// creates the first svg that will contain the svg squares
function init_main_svg() {
    var svg = d3.select('#land #land_charts')
        .append('svg')
        .attr('height', height_division_land);
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
function init_division_world(init_area, svg, first = false) {

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    // creates if first, or just selects
    var rects = first ?
        svg.selectAll('rect.rect_world')
            .data(data)
            .enter()
            .append('rect')
            .attr('id', (d, i) => "world" + i)
            .classed('rect_world', true) :
        svg.selectAll('rect.rect_world')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
    rects
        .attr('width', size)
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
        .attr('fill', 'var(--color-main-land)');

    svg.selectAll('image')
        .remove()
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
function init_division_country(init_area, svg, first = false) {

    var size = Math.sqrt(init_area * 25 / 100)
    var data = [size, size, size, size]
    // creates if first, or just selects
    var rects = first ?
        svg.selectAll('rect.rect_wountry')
            .data(data)
            .enter()
            .append('rect')
            .attr('id', (d, i) => "country" + i)
            .classed('rect_country', true) :
        svg.selectAll('rect.rect_country')
            .on('mouseover', _ => { })
            .data(data)
            .transition()
            .duration(500);
    rects
        .attr('width', size)
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
        .attr('fill', 'var(--color-dark-land)');

    svg.selectAll('image')
        .remove()
}


// updates which big square should be put on top
// for svg, it's the last appened element that is on top
// we use a 'use' element that selects which element it should contain (selected by id) 
function update_level_main(area, svg) {
    svg.selectAll('use').remove();
    // which one should be in front
    var front = area > defaultArea ? "world" : "country";
    for (var i = 0; i < 4; i++) {
        svg.append('use')
            .classed('use', true)
            .attr('id', 'use' + i)
            .attr('xlink:href', "#" + front + i);
    }
}


// updates which small square should be put on top for all 4 categories
// also shows the icon for the element that is on top
function update_levels(svg) {
    for (var i = 0; i < 4; i++) {
        // which one should be in front
        var front = country_sizes[i] > world_sizes[i] ? "world" : "country";
        svg.select('#use' + i)
            .classed('show_icon', true)
            .attr('xlink:href', "#" + front + i);
        svg.select('#icon_' + front + i)
            .transition()
            .duration(300)
            .attr('style', 'opacity:1')
    }
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
    categories.forEach((cat, i) => {
        cat.value = cat.value / s;
        // to be ables to compare, to know which square is smaller, we save the value
        world_sizes[i] = cat.value;
    })

    // add rects
    svg.selectAll('rect.rect_world')
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


    // add icons
    var icon_sizes = [];
    svg.selectAll('svg.icon_w')
        .data(categories)
        .enter()
        .append('svg:image')
        .classed('icon_w', true)
        .classed('anchor_middle', true)
        .attr('id', (d, i) => 'icon_world' + i)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area);
            var icon_size = size / 3 + 10;
            switch (i) {
                case 0:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 1:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 2:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
                case 3:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
            }
            icon_sizes.push(icon_size)
            return `translate(${left},${top})`;
        })
        .attr('width', (d, i) => icon_sizes[i])
        .attr('height', (d, i) => icon_sizes[i])
        .attr('xlink:href', (d, i) => 'img/' + cats[i].img + '.svg')

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
function chart_division_country(svg, data_intake, init_area, country) {

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
    categories.forEach((cat, i) => {
        cat.value = cat.value / s;
        // to be ables to compare, to know which square is smaller, we save the value
        country_sizes[i] = cat.value;
    })

    // add rects
    svg.selectAll('rect.rect_country')
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

    // add icons
    var icon_sizes = [];
    svg.selectAll('svg.icon_c')
        .data(categories)
        .enter()
        .append('svg:image')
        .classed('icon_c', true)
        .classed('anchor_middle', true)
        .attr('id', (d, i) => 'icon_country' + i)
        .attr('x', '50%')
        .attr('y', '50%')
        .attr('transform', (d, i) => {
            var left,
                top,
                area = init_area * d.value;
            var size = Math.sqrt(area);
            var icon_size = size / 3 + 10;
            switch (i) {
                case 0:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 1:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = - (size / 2 + margin_chart_land + icon_size / 2);
                    break;
                case 2:
                    left = size / 2 + margin_chart_land - icon_size / 2;
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
                case 3:
                    left = - (size / 2 + margin_chart_land + icon_size / 2);
                    top = size / 2 + margin_chart_land - icon_size / 2;
                    break;
            }
            icon_sizes.push(icon_size)
            return `translate(${left},${top})`;
        })
        .attr('width', (d, i) => icon_sizes[i])
        .attr('height', (d, i) => icon_sizes[i])
        .attr('xlink:href', (d, i) => 'img/' + cats[i].img + '.svg')
}


// display the percentages and what is composed the hovered area
function display_columns(value, details, columns, country) {
    var g = d3.select("#div_columns");

    g.select("#columns_country").text(country);
    var perc = value * 100;
    g.select("#columns_percentage").text(perc.toFixed(2));
    var html = "";
    columns.forEach(d => {
        html += '<span class="detailedItem">' + d + '</span>'
    })
    g.select("#columns").html(html);
    g.classed("display", true)

    display_details(details)
}

// display everything that is composing a category
function display_details(array) {
    let details = d3.select("#details").html('');

    details.append("p")
        .html("Detailed composition of the category :<br/>")
        .selectAll("span")
        .data(array)
        .enter()
        .append("span")
        .classed("detailedItem", true)
        .text(d => d)
}

// empties the details div and undisplays the text that is between the charts
function reset() {
    d3.select("#details").html('');
    d3.select("#div_columns").classed("display", false);
}


/********************* SCROLL ****************/

var transition_completed = false;
var scroll_sticky = 2100; // TODO
var scroll_animation = 2100;

let textLand = document.getElementById("text_land"),
    p1 = textLand.querySelector("p"),
    p2 = p1.nextElementSibling,
    p3 = p2.nextElementSibling;

function land_scroll(position) {
    if (position > 1600) {
        p1.classList.add("fadeOut");
    } else {
        p1.classList.remove("fadeOut");
    }

    if (position > 2700) {
        p2.classList.add("fadeOut");
    } else {
        p2.classList.remove("fadeOut");
    }
    if (position < scroll_animation && transition_completed) {
        init_division_world(defaultArea, main_svg);
        init_division_country(area_country, main_svg);
        update_level_main(area_country, main_svg)
        reset();
        transition_completed = false;
    }
    if (position > scroll_animation && !transition_completed) {
        d3.select("#details").html(text_animation);
        chart_division_world(main_svg, data_intake, defaultArea);
        chart_division_country(main_svg, data_intake, defaultArea, country);
        update_levels(main_svg)
        transition_completed = true;
    }
}