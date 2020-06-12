(function (d3) {

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
    promises.push(d3.csv("./data/land_world.csv"));
    promises.push(d3.csv("./data/land_arable.csv"));
    promises.push(d3.csv("./data/land_meadows&pastures.csv"));
    promises.push(d3.csv("./data/land_agriculture.csv"));


    Promise.all(promises)
        /***** functions *****/
        .then(function (data) {
            foodco2(data[0]);
            const data_GW = globalwarming(data[1], data[2]);
            chainco2(data[3]);
            land(data[4], data[5], data[6], data[7]);



            /* GLOBAL WARMING */

            // update domains
            xDomain_GW(d3, x_GW, data_GW);
            yDomain_GW(d3, y_GW, data_GW);

            // create and display the chart
            chart_GW(svg_GW, x_GW, y_GW, data_GW);


        });



})(d3);