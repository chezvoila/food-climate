/**
 * Create JS objects containing the data needed for the viz
 *
 * @param if_everyone       Data about how much Earth's would we need if everyone what consumming like a specific country
 * @param intake            Intake (kg/capita/year) for different types of food per country
 */
function land(if_everyone, intake) {
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
            // categories
            var cereals = ["Wheat and products", "Rice and products", "Barley and products", "Maize and products",
                "Rye and products", "Oats", "Millet and products", "Sorghum and products", "Cereals, Other"];
            var roots = ["Cassava and products", "Potatoes and products", "Sweet potatoes", "Yams", "Roots, Other"];
            var sweeteners = ["Sugar cane", "Sugar beet", "Sugar non-centrifugal", "Sugar (Raw Equivalent)", "Sweeteners, Other"]
            var pulses = ["Honey", "Beans", "Peas", "Pulses, Other and products"] // to change
            var oilcrops = ["Nuts and products", "Soyabeans", "Groundnuts (Shelled Eq)", "Sunflower seed", "Rape and Mustardseed", "Cottonseed",
                "Coconut - Incl Copra", "Sesame Seed", "Palm kernels", "Olives (including preserved)", "Oilcrops, Other"];
            var oils = ["Soyabean Oil", "Groundnut Oil", "Sunflowerseed Oil", "Rape and Mustard Oil", "Cottonseed Oil", "Palmkernel Oil", "Palm Oil",
                "Coconut Oil", "Sesameseed Oil", "Olive Oil", "Ricebran Oil", "Maize Germ oil", "Oilcrops Oil, Other"];
            var vegetables = ["Tomatoes and products", "Onions", "Vegetables, Other"];
            var fruits = ["Oranges, Mandarines", "Lemons, Limes and products", "Grapefruit and products", "Citrus,Others", "Bananas", "Plantains",
                "Apples and products", "Pineapples and products", "Dates", "Grapes and products (excl wine)", "Fruits, Other"];
            var spices = ["Coffee and products", "Cacao Beans and products", "Tea (including mate)", "Pepper", "Pimento", "Cloves", "Spices, Other"];
            var beverages = ["Wine", "Beer", "Beverages, Fermented", "Beverages, Alcoholic", "Alcohol, Non-Food"];
            var meat = ["Bovine Meat", "Mutton & Goat Meat", "Pigmeat", "Poultry Meat", "Meat, Other", "Meat, Aquatic Mammals"];
            var fish = ["Freshwater Fish", "Demersal Fish", "Pelagic Fish", "Marine Fish, Other", "Crustaceans", "Cephalopods", "Molluscs, Other"];
            var others = ["Offals, Edible", "Butter, Ghee", "Cream", "Fats, Animals, Raw", "Fish, Body Oil", "Fish, Liver Oil", "Eggs",
                "Milk - Excluding Butter"];
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

const margin_chart_land = 10;
const height_division_land = 500;


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


var cat1 = {
    name: "Fruits, Vegetables, Cereals and other Crops",
    columns: ["fruits", "vegetables", "cereals", "oilcrops"]
}
var cat2 = {
    name: "Meat and Fish",
    columns: ["meat", "fish"]
}
var cat3 = {
    name: "Sugar and Oils",
    columns: ["oils", "sweeteners"]
}
var cat4 = {
    name: "Other",
    columns: ["roots", "pulses", "spices", "others"]
}
// missing : beverages, because more drink than food

/**
 * Displays 4 rects elements forming a big rectangle to show the surface of a country
 *
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaCountry
 */
function chart_division_world(svg, data_intake, init_area) {

    var mean_data = {
        cereals: d3.mean(data_intake.map(d => d.value.cereals.value)),
        roots: d3.mean(data_intake.map(d => d.value.roots.value)),
        sweeteners: d3.mean(data_intake.map(d => d.value.sweeteners.value)),
        pulses: d3.mean(data_intake.map(d => d.value.pulses.value)),
        oilcrops: d3.mean(data_intake.map(d => d.value.oilcrops.value)),
        oils: d3.mean(data_intake.map(d => d.value.oils.value)),
        vegetables: d3.mean(data_intake.map(d => d.value.vegetables.value)),
        fruits: d3.mean(data_intake.map(d => d.value.fruits.value)),
        spices: d3.mean(data_intake.map(d => d.value.spices.value)),
        beverages: d3.mean(data_intake.map(d => d.value.beverages.value)),
        meat: d3.mean(data_intake.map(d => d.value.meat.value)),
        fish: d3.mean(data_intake.map(d => d.value.fish.value)),
        others: d3.mean(data_intake.map(d => d.value.others.value))
    }

    var categories = [cat1, cat2, cat3, cat4];
    var s = 0;
    // get the sum of the values of each category
    categories.forEach(cat => {
        var value = d3.sum(cat.columns.map(d => mean_data[d]));
        s += value;
        cat.value = value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    svg.selectAll('rect')
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

    svg.selectAll('text')
        .data(categories)
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
 * @param svg               Svg containing the squares.
 * @param data_intake       Intake (kg/capita/year) for different types of food per country 
 * @param init_area         Area value of the world coming from getAreaWorld
 * @param country           Name of the country
 * @param color             Color function
 */
function chart_division_country(svg, data_intake, init_area, country, color) {

    var element = data_intake.find(d => d.key == country);

    var categories = [cat1, cat2, cat3, cat4];
    var s = 0;
    // get the sum of the values of each category
    categories.forEach(cat => {
        var value = d3.sum(cat.columns.map(d => element.value[d].value));
        s += value;
        cat.value = value;
    })
    // get the value as percentage
    categories.forEach(cat => {
        cat.value = cat.value / s;
    })

    svg.selectAll('rect')
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

    svg.selectAll('text')
        .data(categories)
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