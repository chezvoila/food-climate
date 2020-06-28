"use strict";

async function foodchoice(data, _) {

    /***** DOM *****/
    let a = document.querySelectorAll("#food_choice nav a");
    let ul = document.querySelector("#food_choice > ul");
    let btn = document.querySelector("#food_choice button");
    let categories = [];
    let ingredientsIDs = [];
    let dish = false;

    /***** bind events *****/
    a.forEach((el) => {
        el.addEventListener("click", selectFoodCategory);
    })

    function selectFoodCategory(e) {
        d3.selectAll('#food_choice ul li.hover').classed('hover', false)
        dish = false;
        var classlist = this.classList;
        var name = classlist[0];
        // if length > 1, means there's also hover, means it's in categories, means it has to be removed
        if (classlist.length > 1) categories = categories.filter(c => c != name)
        else categories.push(name)
        e.target.closest("A").classList.toggle("hover");
    }


    ul.addEventListener("click", selectDish);

    function selectDish(e) {
        let li = e.target.closest("li");
        let food;
        if (li) {
            let foodText = li.querySelector("span").innerHTML;
            food = data.filter(el => el.dish == foodText);

            ul.querySelectorAll("li").forEach(el => {
                el.classList.remove("hover");
            })
            a.forEach(el => {
                el.classList.remove("hover");
            });
            
            dish = true;
            ingredientsIDs = [];
            categories = food[0].categories;

            food[0].ingredients.forEach((el, i) => {
                ingredientsIDs.push(food[0].ingredients[i].id);
            })

            li.classList.toggle("hover");
            a.forEach(el => {
                categories.forEach(j => {
                    if (el.classList.value == j) {
                        el.classList.add("hover");
                    }
                })
            })
        }
    }

    btn.addEventListener("click", function () {
        foodco2(data[0], _, dish?ingredientsIDs:categories, dish);
    });













    return {
    }
}


/********************* SCROLL ****************/

// let p = document.querySelector("#food_choice p:first-child");
// let img = document.querySelector("#food_choice img");

function food_choice_scroll(position) {
    // if(position >= 0 && position < 1100) {
    //     p.classList.add("sticky");
    // } else {
    //     p.classList.add("fadeOut");
    // }

    // if(position >= 1100 && position < 1900) {
    //     img.classList.add("sticky");
    // }

    // if(position >= 1900) {
    //     img.classList.add("left");
    // }
}



