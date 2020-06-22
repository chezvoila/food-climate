"use strict";

async function foodchoice(_) {

    /***** DOM *****/
    let a = document.querySelectorAll("#food_choice nav a");

    /***** bind events *****/
    a.forEach((el) => {
        el.addEventListener("click", selectFoodCategory);
    })

    function selectFoodCategory(e) {
        e.target.closest("A").classList.toggle("hover");
    }





    
    
    

    return {
        
    }
}


/********************* SCROLL ****************/

let p = document.querySelector("#food_choice p:first-child");
let img = document.querySelector("#food_choice img");

function food_choice_scroll(position) {
    if(position >= 0 && position < 1100) {
        p.classList.add("sticky");
    } else {
        p.classList.add("fadeOut");
    }

    if(position >= 1100 && position < 1900) {
        img.classList.add("sticky");
    }

    if(position >= 1900) {
        img.classList.add("left");
    }
}



