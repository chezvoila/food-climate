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
    var food_choice_result;
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
    promises.push(d3.json("./data/dishes.json"));


    Promise.all(promises)
    
        /***** functions *****/
        .then(function (data) {
            d3.select('#loader').classed('loaded',true)
            d3.select('#frame').classed('loaded',true)
            foodchoice(data[6],_);
            foodco2(data[0], _);
            const data_GW = globalwarming(data[1], data[2]);
            chainco2(data[3]);
            const data_land = land(data[4], data[5]);



            /* GLOBAL WARMING */ 



        });










        /*************************** SCROLLING  *************************/


        /******* Setting *******/
        let pos = [];
        let pages = ["intro", "food_choice", "food_choice_transition", "food_co2", "global_warming", "chain_co2", "land"]
        let currentIndex = 0;
        let direction = undefined;
        let flag = true;
        let scrollPosition = undefined;
        let touchStart;


        /******* DOM *******/
        let page = document.querySelectorAll(".page");




        /******* Init *******/

        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`; 

        page.forEach(el => {
            el.addEventListener("wheel", isScrollDown, { passive: true });
            el.addEventListener("wheel", wheelFunc, { passive: true });

            el.addEventListener("touchmove", isTouchDown, { passive: true });
            el.addEventListener("touchstart", function(e) {
                touchStart = e.touches[0].clientY;
            }, { passive: true });
            el.addEventListener("touchend", isTouchDown, { passive: true });
            el.addEventListener("touchmove", touchFunc, { passive: true });
        });

        page.forEach(el => {
            el.addEventListener("scroll", scrollFunc);
        });

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }





        /******* Functions *******/

        function isTouchDown(event) {
            if(flag) {
                let touchEnd = event.changedTouches[0].clientY;
                if((touchStart > touchEnd+1)){
                    direction = true;
                }else if((touchStart < touchEnd-1)){
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
                    intro_scroll(scrollPosition);
                    break;
                case 1:
                    food_choice_scroll(scrollPosition);
                    break;
                case 3:
                    break;
                case 4:
                    global_warming_scroll(scrollPosition);
                    break;
                case 5:
                    chain_co2_scroll(scrollPosition);
                    break;
                case 6:
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
            if(dir) {
                total = el.scrollTop + el.clientHeight;
                if((total >= element.clientHeight) && (index < 6) && flag  && (index != 1)) {    
                    jumpNext(el.nextElementSibling);
                    change_page_scroll(index + 1);
                }
            } else {
                if((el.scrollTop == 0) && (index != 0) && flag) {
                    jumpPrev(el.previousElementSibling);
                    change_page_scroll(index - 1);
                }
            }
        }

        function onWheel(dir, index, src) {
            let total;
            let el = src.parentNode;
            let element = el.querySelector("section");
            if(dir) {
                total = el.scrollTop + el.clientHeight;
                if((total >= element.clientHeight) && (index < 6) && flag && (index != 1)) {    
                    jumpNext(el.nextElementSibling);
                    change_page_scroll(index + 1);
                }
            } else {
                if((el.scrollTop == 0) && (index != 0) && flag) {
                    jumpPrev(el.previousElementSibling);
                    change_page_scroll(index - 1);
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
            if(currentIndex == 2) {
                const DOM = {};
                DOM.parent = document.querySelector("#frame");
                DOM.shape = DOM.parent.querySelector('#food_choice_transition svg.shape');
                DOM.path = DOM.shape.querySelector('path'); 
                anime({
                    targets: DOM.path,
                    duration: 700,
                    easing: 'easeInOutSine',
                    d: DOM.path.getAttribute('pathdata:id')
                });
                jumpNext(el.nextElementSibling)
                
                setTimeout(function() {
                    document.querySelector("#food_choice_transition").style.display = "none";
                }, 1000);
                
            }
        }

        document.querySelector("#food_choice button").addEventListener("click", function () {
            jumpNext(document.querySelector("#food_choice").parentNode.nextElementSibling)
            food_co2_scroll(scrollPosition);
        });


        function jumpPrev(el) {
            flag = false;
            currentIndex--;
            document.querySelector("#frame").style.transform = `translate3d(0, -${currentIndex * 100}%, 0)`;
            setTimeout(function() {
                flag = true;
            }, 700);
            if(currentIndex == 2) {
                jumpPrev(el.previousElementSibling)
            } 
        }



        function change_page_scroll(index) {
            switch (index) {
                case 0:
                    document.body.classList.add("intro");
                    document.body.classList.remove("food_choice");
                    break;
                case 1:
                    document.body.classList.add("food_choice");
                    document.body.classList.remove("intro");
                    document.body.classList.remove("food_choice_transition");
                    break;
                case 2:
                    document.body.classList.add("food_choice_transition");
                    document.body.classList.remove("food_choice");
                    document.body.classList.remove("food_co2");
                    break;
                case 3:
                    document.body.classList.add("food_co2");
                    document.body.classList.remove("food_choice");
                    document.body.classList.remove("global_warming");
                    break;
                case 4:
                    document.body.classList.add("global_warming");
                    document.body.classList.remove("food_co2");
                    document.body.classList.remove("chain_co2");
                    break;
                case 5:
                    document.body.classList.add("chain_co2");
                    document.body.classList.remove("global_warming");
                    document.body.classList.remove("land");
                break;
                case 6:
                    document.body.classList.add("land");
                    document.body.classList.remove("chain_co2");
                break;
            }
        }




        /*************************** SCROLLING  *************************/







        /***************************SMOOOTH SCROLL *********************************/


















        /*************************** TRANSITION  *************************/


















        particlesJS("particles-js", {
            "particles": {
              "number": {
                "value": 19,
                "density": {
                  "enable": true,
                  "value_area": 481.0236182596568
                }
              },
              "color": {
                "value": "#4a290c"
              },
              "shape": {
                "type": "circle",
                "stroke": {
                  "width": 0,
                  "color": "#000000"
                },
                "polygon": {
                  "nb_sides": 12
                },
                "image": {
                  "src": "https://www.sprinklr.com/wp-content/themes/sprinklr/assets/images/logo_sprinklr.svg",
                  "width": 250,
                  "height": 100
                }
              },
              "opacity": {
                "value": 0.3286994724774322,
                "random": true,
                "anim": {
                  "enable": false,
                  "speed": 1,
                  "opacity_min": 0.1,
                  "sync": false
                }
              },
              "size": {
                "value": 47.34885849793636,
                "random": true,
                "anim": {
                  "enable": true,
                  "speed": 9.59040959040959,
                  "size_min": 5.594405594405594,
                  "sync": true
                }
              },
              "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#000",
                "opacity": 0.4,
                "width": 1
              },
              "move": {
                "enable": true,
                "speed": 6.413648243462092,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "bounce",
                "bounce": false,
                "attract": {
                  "enable": true,
                  "rotateX": 320.6824121731046,
                  "rotateY": 481.0236182596568
                }
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": true,
                  "mode": "repulse"
                },
                "onclick": {
                  "enable": true,
                  "mode": "push"
                },
                "resize": true
              },
              "modes": {
                "grab": {
                  "distance": 400,
                  "line_linked": {
                    "opacity": 1
                  }
                },
                "bubble": {
                  "distance": 400,
                  "size": 40,
                  "duration": 2,
                  "opacity": 8,
                  "speed": 3
                },
                "repulse": {
                  "distance": 200,
                  "duration": 0.4
                },
                "push": {
                  "particles_nb": 4
                },
                "remove": {
                  "particles_nb": 2
                }
              }
            },
            "retina_detect": true
          });
})(d3);