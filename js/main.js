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
            d3.select('#loader').classed('loaded', true)
            foodchoice(_);
            foodco2(data[0], _);
            globalwarming(data[1], data[2]);
            chainco2(data[3]);
            land(data[4], data[5]);

        });




    /*************************** SCROLLING  *************************/


    /******* Setting *******/
    let pos = [];
    let pages = ["intro", "food_choice", "food_co2", "global_warming", "chain_co2", "land"]
    let currentIndex = 0;
    let direction = undefined;
    let flag = true;
    let scrollPosition = undefined;
    // let lastTouchY;
    let touchStart;


    /******* DOM *******/
    let page = document.querySelectorAll(".page");
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }



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
                intro(scrollPosition);
                break;
            case 1:
                food_choice_scroll(scrollPosition);
                break;
            case 2:
                food_co2_scroll(scrollPosition);
                break;
            case 3:
                global_warming_scroll(scrollPosition);
                break;
            case 4:
                chain_co2_scroll(scrollPosition);
                break;
            case 5:
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
            if ((total >= element.clientHeight) && (index < 5) && flag) {
                jumpNext(el.nextElementSibling);
                change_page_scroll(index + 1);
            }
        } else {
            if ((el.scrollTop == 0) && (index != 0) && flag) {
                jumpPrev(el.previousElementSibling);
                change_page_scroll(index - 1);
            }
        }
    }


    function onWheel(dir, index, src) {
        let total;
        let el = src.parentNode;
        let element = el.querySelector("section");
        if (dir) {
            total = el.scrollTop + el.clientHeight;
            if ((total >= element.clientHeight - 1) && (index < 5) && flag) {
                jumpNext(el.nextElementSibling);
                change_page_scroll(index + 1);
            }
        } else {
            if ((el.scrollTop == 0) && (index != 0) && flag) {
                jumpPrev(el.previousElementSibling);
                change_page_scroll(index - 1);
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



    function change_page_scroll(index) {
        switch (index) {
            case 0:
                document.body.classList.add("intro");
                document.body.classList.remove("food_choice");
                break;
            case 1:
                document.body.classList.add("food_choice");
                document.body.classList.remove("intro");
                document.body.classList.remove("food_co2");
                break;
            case 2:
                document.body.classList.add("food_co2");
                document.body.classList.remove("food_choice");
                document.body.classList.remove("global_warming");
                break;
            case 3:
                document.body.classList.add("global_warming");
                document.body.classList.remove("food_co2");
                document.body.classList.remove("chain_co2");
                break;
            case 4:
                document.body.classList.add("chain_co2");
                document.body.classList.remove("global_warming");
                document.body.classList.remove("land");
                break;
            case 5:
                document.body.classList.add("land");
                document.body.classList.remove("chain_co2");
                break;
        }
    }







    // document.body.onkeydown = function(e) {
    //     var code = e.keyCode;
    //     if(code === 40) { // key code for down arrow
    //         let string  = `#${document.body.classList.value}`;
    //         let element = document.querySelector(string);
    //         console.log(element)
    //         element.scrollTop = element.scollTop + 5;
    //         onWheel(true, currentIndex, element);
    //     }
    // };

    /*************************** SCROLLING  *************************/






    /***************************SMOOOTH SCROLL *********************************/


})(d3);