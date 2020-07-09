async function intro(_) {

    
    
    

    return {
        
    }
}

/********************* SCROLL ****************/
let introSection = document.querySelector("#intro")

let h1 = introSection.querySelector("h1:not(:first-child)");
let imgMiddle = introSection.querySelector("h1 + figure");
let pImg = introSection.querySelector("figure + p");
let p = introSection.querySelector("p + p");
let h2 = introSection.querySelector("h2");
let imgLast = introSection.querySelector("h2 + figure");

function intro_scroll(position) {
    if(position >= 700 && position < 3200) {
        h1.classList.add("fadeIn");
    } else {
        h1.classList.remove("fadeIn");
    }

    if(position >= 3000 && position < 4000) {
        p.classList.add("fadeIn");
    } else {
        p.classList.remove("fadeIn");
    }

    if(position >= 2600) {
        imgMiddle.classList.add("fadeOut");
        pImg.classList.add("fadeOut")
    } else {
        imgMiddle.classList.remove("fadeOut");
        pImg.classList.remove("fadeOut")
    }

    if(position >= 4200) {
        h2.classList.add("fadeIn");
        imgLast.classList.add("fadeIn");
    } else {
        h2.classList.remove("fadeIn");
        imgLast.classList.remove("fadeIn");
    }
}