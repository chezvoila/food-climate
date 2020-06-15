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



        /***** bind events *****/



        /***** Loading data *****/
        var promises = [];
        promises.push(d3.csv("./data/foodco2.csv"));
        // promises.push(d3.csv("./data/globalwarming.csv"));
        // promises.push(d3.csv("./data/chainco2.csv"));
        // promises.push(d3.csv("./data/land.csv"));


        Promise.all(promises)
                /***** functions *****/
                .then(function (data) {
                        foodco2(data[0], _);
                        // globalwarming(data[1]);
                        // chainco2(data[2]);
                        // land(data[3]);

                });
})(d3);