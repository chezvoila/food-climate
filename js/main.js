(function (d3) {

        /***** DOM *****/



        /***** bind events *****/



        /***** Loading data *****/
        var promises = [];
        promises.push(d3.csv("./data/foodco2.csv"));
        // promises.push(d3.csv("./data/globalwarming.csv"));
        // promises.push(d3.csv("./data/chainco2.csv"));
        // promises.push(d3.csv("./data/land.csv"));

        Promise.all(promises)
                .then(function (data) {
                        let foodco2 = data[0];

                /***** Data preprocessing *****/

                });
})(d3);