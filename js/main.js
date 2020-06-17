"use strict";

(function (d3) {
        /***** settings *****/
        let _ = {
                colors: {
                        dark3: "#160508",
                        dark2: "#581420",
                        dark1: "#992437",
                        main: "#db334f",
                        light1: "#e67084",
                        light2: "#f1adb9",
                        light3: "#fbebed",
                        icon_bg: "#a8243a",
                        icon_hover: "#6b101f"
                }
        }


    /***** DOM *****/


    /* GLOBAL WARMING */
    var elements = create_GW(d3);
    var svg_GW = elements.svg,
        x_GW = elements.x,
        y_GW = elements.y;

    /* LAND */

    var color = d3.scaleOrdinal(d3.schemePaired).range(['#ffffff', '#992437']); // TO DEFINE

    /***** bind events *****/



    /***** Loading data *****/
    var promises = [];
    promises.push(d3.csv("./data/foodco2.csv"));
    // promises.push(d3.csv("./data/globalwarming.csv"));
    promises.push(d3.csv("./data/globalwarming_emissions.csv"));
    promises.push(d3.csv("./data/globalwarming_temperature.csv"));
    promises.push(d3.json("./data/chainco2.json"));
    promises.push(d3.csv("./data/land_world.csv"));
    promises.push(d3.csv("./data/land_arable.csv"));
    promises.push(d3.csv("./data/land_meadows&pastures.csv"));
    promises.push(d3.csv("./data/land_agriculture.csv"));


    Promise.all(promises)
        /***** functions *****/
        .then(function (data) {
            foodco2(data[0], _);
            const data_GW = globalwarming(data[1], data[2]);
            chainco2(data[3]);
            const data_land = land(data[4], data[5], data[6], data[7]);



            /* GLOBAL WARMING */

            // update domains
            xDomain_GW(d3, x_GW, data_GW);
            yDomain_GW(d3, y_GW, data_GW);

            // create and display the chart
            chart_GW(svg_GW, x_GW, y_GW, data_GW);


            /* LAND */

            // Get different sets of data
            const data_world = data_land.world;
            const data_agriculture = data_land.agriculture;
            const data_arable = data_land.arable;
            const data_mead_past = data_land.mead_past;

            // Make a list of the countries that are in the 4 datasets
            const lands_available = make_list_land(data_world, data_agriculture, data_arable, data_mead_past);

            // update color domain
            land_color_domain(color, lands_available);

            // get areas
            var area_world = getAreaWorld(data_world);
            var area_country = getMeanArea(data_world);
            // default display is the mean surface of a country
            var country = "World";
            // display the 2 charts
            var svg_world = init_division_world(area_world, color, true);
            var svg_country = init_division_country(area_country, color, true, null, country);
            // transitions on mouseover and mouseout
            d3.select("#land_charts").on("mouseover", _ => {
                chart_division_world(svg_world, data_agriculture, data_arable, data_mead_past, area_world, color);
                chart_division_country(svg_country, data_agriculture, data_arable, data_mead_past, area_country, country, color);
            })
                .on("mouseout", _ => {
                    init_division_world(area_world, color, false, svg_world);
                    init_division_country(area_country, color, false, svg_country, country);
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
                    area_country = getAreaCountry(data_world, country)
                    init_division_country(area_country, color, false, svg_country, country);
                }
            });
        });

})(d3);