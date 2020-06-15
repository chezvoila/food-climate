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

    /***** bind events *****/



    /***** Loading data *****/
    var promises = [];
    promises.push(d3.csv("./data/foodco2.csv"));
    // promises.push(d3.csv("./data/globalwarming.csv"));
    promises.push(d3.csv("./data/globalwarming_emissions.csv"));
    promises.push(d3.csv("./data/globalwarming_temperature.csv"));
    promises.push(d3.json("./data/chainco2.json"));
    // promises.push(d3.csv("./data/land.csv"));


    Promise.all(promises)
        /***** functions *****/
        .then(function (data) {
            foodco2(data[0], _);
            const data_GW = globalwarming(data[1], data[2]);
            chainco2(data[3]);
            // land(data[4]);



            /* GLOBAL WARMING */

            // update domains
            xDomain_GW(d3, x_GW, data_GW);
            yDomain_GW(d3, y_GW, data_GW);

            // create and display the chart
            chart_GW(svg_GW, x_GW, y_GW, data_GW);


        });

})(d3);