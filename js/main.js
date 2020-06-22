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
            foodchoice(_);
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










        /*************************** SCROLLING  *************************/


        /******* Setting *******/
        let pos = [];
        let pages = ["food_choice", "food_co2", "global_warming", "chain_co2", "land"]
        let currentIndex = 0;
        let direction = undefined;
        let flag = true;
        let scrollPosition = undefined;


        /******* DOM *******/
        let page = document.querySelectorAll(".page");





        /******* Init *******/
        setTimeout(function() {
            pages.forEach(el => {
                sectionCalculate(el);
            });
        }, 1000);

        page.forEach(el => {
            el.addEventListener("wheel", isScrollDown);
            el.addEventListener("wheel", wheelFunc);
        });

        page.forEach(el => {
            el.addEventListener("scroll", scrollFunc);
        })


        /******* Functions *******/

        function sectionCalculate(sectionId) {
            let el = document.getElementById(sectionId);
            let height = window.getComputedStyle(el, null).getPropertyValue("height");
            pos.push({
                section: el,
                height: height
            });
        }

        function isScrollDown(event) {
            if (event.wheelDelta < 0) { 
                direction = true;
            } else {
                direction = false;
            }
            return direction; 
        }

        function wheelFunc(e) {
            onWheel(direction, currentIndex, e.srcElement.closest("section"));
        }

        function scrollFunc(e) {
            scrollPosition = inScroll(e.srcElement.querySelector("section"));
            console.log(scrollPosition)
            
            switch (currentIndex) {
                case 0:
                    food_choice_scroll(scrollPosition);
                    break;
                case 1:
                    food_co2_scroll(scrollPosition);
                    break;
                case 2:
                    global_warming_scroll(scrollPosition);
                    break;
                case 3:
                    chain_co2_scroll(scrollPosition);
                    break;
                case 4:
                    land_scroll(scrollPosition);
                break;
            }
        }

        function inScroll(src) {
            return src.parentNode.scrollTop
        }

        function onWheel(dir, index, src) {
            let total;
            let el = src.parentNode;
            let element = el.querySelector("section");
            if(dir) {
                total = el.scrollTop + el.clientHeight;
                if((total >= element.clientHeight) && (index < 4) && flag) {    
                    jumpNext(el.nextElementSibling);
                }
            } else {
                if((el.scrollTop == 0) && (index != 0) && flag) {
                    jumpPrev(el.previousElementSibling);
                }
            }
        }

        function jumpNext(el) {
            flag = false;
            currentIndex++;
            document.querySelector("#frame").style.transform = `translate3d(0, -${currentIndex * 100}%, 0)`;
            setTimeout(function() {
                flag = true;
            }, 700);
        }


        function jumpPrev(el) {
            flag = false;
            currentIndex--;
            document.querySelector("#frame").style.transform = `translate3d(0, -${currentIndex * 100}%, 0)`;
            setTimeout(function() {
                flag = true;
            }, 700);
        }

        /*************************** SCROLLING  *************************/

})(d3);