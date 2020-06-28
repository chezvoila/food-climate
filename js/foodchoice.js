"use strict";

async function foodchoice(data, _) {

    /***** DOM *****/
    let a = document.querySelectorAll("#food_choice nav a");
    let li = document.querySelectorAll("#food_choice > ul > li");
    let btn = document.querySelector("#food_choice button");
    let categories = [];
    let ingredientsIDs = [];

    /***** bind events *****/
    a.forEach((el) => {
        el.addEventListener("click", selectFoodCategory);
    })

    function selectFoodCategory(e) {
        e.target.closest("A").classList.toggle("hover");
    }


    li.forEach((el) => {
        el.addEventListener("click", selectDish);
    })

    btn.addEventListener("click", function() {
     foodco2(data[0], _, ingredientsIDs);
    });









    function selectDish(e) {
        li.forEach(el => {
            if(el != e.target) {
                el.classList.remove("hover");
            }
        });
        a.forEach(el => {
            el.classList.remove("hover");
            ingredientsIDs = [];
        });
        e.target.classList.toggle("hover");

        let food = e.target.closest("li").querySelector("span").innerHTML;
        let filterData = data.filter(el => el.dish == food);
        categories = filterData[0].categories;
        filterData[0].ingredients.forEach((el, i) => {
            ingredientsIDs.push(filterData[0].ingredients[i].id);
            console.log(filterData[0].ingredients[i].id)
        })

        if(e.target.classList.contains("hover")) {
            a.forEach(el => {
                categories.forEach(j => {
                    if(el.classList.value == j) {
                        el.classList.add("hover");
                    }
                })
            })
        }
    }








    
    
    

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



