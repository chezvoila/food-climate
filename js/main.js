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
    // promises.push(d3.csv("./data/chainco2.csv"));
    // promises.push(d3.csv("./data/land.csv"));


    Promise.all(promises)
        /***** functions *****/
        .then(function (data) {
            foodco2(data[0]);
            const data_GW = globalwarming(data[1], data[2]);
            // chainco2(data[2]);
            // land(data[3]);



            /* GLOBAL WARMING */

            // update domains
            xDomain_GW(d3, x_GW, data_GW);
            yDomain_GW(d3, y_GW, data_GW);

            // create and display the chart
            chart_GW(svg_GW, x_GW, y_GW, data_GW);


        });



})(d3);