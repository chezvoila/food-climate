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
    promises.push(d3.csv("./data/land_if_everyone.csv"));
    // https://ourworldindata.org/agricultural-land-by-global-diets
    // data from 2011
    promises.push(d3.csv("./data/land_intake_country.csv"));
    // http://www.fao.org/faostat/en/#data/FBS
    // data from 2017


    Promise.all(promises)
        /***** functions *****/
        .then(function (data) {
            foodchoice(_);
            foodco2(data[0], _);
            const data_GW = globalwarming(data[1], data[2]);
            chainco2(data[3]);
            // const data_land = land(data[4], data[5], data[6], data[7]);
            const data_land = land(data[4], data[5]);



            /* GLOBAL WARMING */

            // update domains
            xDomain_GW(d3, x_GW, data_GW);
            yDomain_GW(d3, y_GW, data_GW);

            // create and display the chart
            chart_GW(svg_GW, x_GW, y_GW, data_GW);


            /* LAND */

            // Get different sets of data
            const data_consumption = data_land.consumption;
            const data_intake = data_land.intake;

            // Make a list of the countries that are in the 4 datasets
            const lands_available = make_list_land(data_consumption, data_intake);
            lands_available.push("World")

            // update color domain
            land_color_domain(color, lands_available);

            // default display is Canada
            var country = "Canada";
            // get areas
            const defaultArea = 100000;
            var area_country = getAreaCountry(defaultArea, data_consumption, country);
            // append (so first = true) and display the 2 charts
            var svg_world = init_division_world(defaultArea, color, true);
            var svg_country = init_division_country(area_country, color, true, country);
            // transitions on mouseover and mouseout
            d3.select("#land_charts")
                .on("click", _ => {
                    chart_division_world(svg_world, data_intake, defaultArea);
                    chart_division_country(svg_country, data_intake, defaultArea, country, color);
                })
            // .on("mouseout", _ => {
            //     init_division_world(defaultArea, color, false, svg_world);
            //     init_division_country(area_country, color, false, country, svg_country);
            // })

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
        });










    /*************************** SCROLLING  *************************/


    /******* Setting *******/
    let pos = [];
    let pages = ["food_choice", "food_co2", "global_warming", "chain_co2", "land"]
    let currentIndex = 0;
    let direction = undefined;
    let flag = true;
    let scrollPosition = undefined;
    // let lastTouchY;
    let touchStart;


    /******* DOM *******/
    let page = document.querySelectorAll(".page");




    /******* Init *******/
    setTimeout(function () {
        pages.forEach(el => {
            sectionCalculate(el);
        });
    }, 1000);

    page.forEach(el => {
        el.addEventListener("wheel", isScrollDown);
        el.addEventListener("wheel", wheelFunc);

        // el.addEventListener("touchmove", isTouchDown);
        el.addEventListener("touchstart", function (e) {
            touchStart = e.touches[0].clientY;
        });
        el.addEventListener("touchend", isTouchDown);
        el.addEventListener("touchmove", touchFunc);
    });

    page.forEach(el => {
        el.addEventListener("scroll", scrollFunc);
    });

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }




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
    function isTouchDown(event) {
        if (flag) {
            let touchEnd = event.changedTouches[0].clientY;
            if ((touchStart > touchEnd + 5)) {
                direction = true;
            } else if ((touchStart < touchEnd - 5)) {
                direction = false;
            }
            return direction;
        }
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

    function touchFunc(e) {
        onTouch(direction, currentIndex, e.srcElement.closest("section"));
    }

    function scrollFunc(e) {
        scrollPosition = inScroll(e.srcElement.querySelector("section"));

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

    function onTouch(dir, index, src) {
        let total;
        let el = src.parentNode;
        let element = el.querySelector("section");
        if (dir) {
            total = el.scrollTop + el.clientHeight;
            if ((total >= element.clientHeight) && (index < 4) && flag) {
                jumpNext(el.nextElementSibling);
            }
        } else {
            if ((el.scrollTop == 0) && (index != 0) && flag) {
                jumpPrev(el.previousElementSibling);
            }
        }
    }

    function onWheel(dir, index, src) {
        let total;
        let el = src.parentNode;
        let element = el.querySelector("section");
        if (dir) {
            total = el.scrollTop + el.clientHeight;
            if ((total >= element.clientHeight) && (index < 4) && flag) {
                jumpNext(el.nextElementSibling);
            }
        } else {
            if ((el.scrollTop == 0) && (index != 0) && flag) {
                jumpPrev(el.previousElementSibling);
            }
        }
    }


    function jumpNext(el) {
        flag = false;
        currentIndex++;
        document.querySelector("#frame").style.transform = `translate3d(0, -${currentIndex * 100}%, 0)`;
        setTimeout(function () {
            flag = true;
        }, 700);
    }


    function jumpPrev(el) {
        flag = false;
        currentIndex--;
        document.querySelector("#frame").style.transform = `translate3d(0, -${currentIndex * 100}%, 0)`;
        setTimeout(function () {
            flag = true;
        }, 700);
    }

    /*************************** SCROLLING  *************************/







    /***************************SMOOOTH SCROLL *********************************/


})(d3);