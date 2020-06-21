"use strict";

async function foodco2(data, _) {

    /***** processing data *****/


    let foodSelected = ["Pig Meat", "Coffee", "Eggs", "Nuts", "Rice", "Wheat & Rye (Bread)", "Potatoes",
                        "Poultry Meat", "Milk", "Fish (farmed)", "Beef (beef herd)", "Cheese"],
        foodShortNames = ["Pork", "Coffee", "Eggs", "Nuts", "Rice", "Wheat", "Potatoes",
                        "Chicken", "Milk", "Fish", "Beef", "Cheese"],
        exceptionList = ["beef", "fish", "wheat"];

    data = data.map(d => {
        return {
            food: d["Food product"],
            sum: Object.keys(d).filter(el => (el != "Food product"))
            .reduce((sum,key)=>sum+parseFloat(d[key]||0),0)
        }
    }).filter((el, i) => {
        
        let index = foodSelected.indexOf(el.food);
        if (index != -1) {
            el.food = foodShortNames[index];
            return true
        }
    });
    

    /***** domain & range *****/


    /***** plot data *****/
    const sqrSize = 17,
        gap = 2,
        cols = 12,
        padding = 20;

    let g = d3.select("#food_co2")
    .append("svg")
    // .attr("viewBox", "0 0 1142 700")
    .append("g")
    .attr("transform", "translate(0, 40)")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", d => d.food.toLowerCase())
    .classed("figure", true)
    .attr("transform", (d, i) => {
        let rowIndex = Math.floor(i/3),
            colIndex = i%3;
        return `translate(${colIndex*418}, ${rowIndex*200})`
    })
    // .style("outline", "1px dashed #bd364c")
    // .style("cursor", "pointer")
    .on("mouseenter", function() {
        changeColor(this)
    })
    .on("mouseleave", function() {
        changeColor(this);
    });

    g.append("rect")
    .classed("container", true)
    .attr("width", "226")
    .attr("height", "93")
    .attr("fill", "transparent")
    .attr("x", 0)
    .attr("y", 10)
    // .style("outline", "1px solid black");

    g.append("text")
    .text(d => d.food)
    .attr("fill", _.colors.dark1)
    .attr("x", 0)
    .attr("y", 0);


    g.selectAll("rect:not(.container)")
    .data(d => d3.range(d.sum))
    .enter()
    .append("rect")
    .attr("width", sqrSize)
    .attr("height", sqrSize)
    .attr("x", (d, i) => {
        let colIndex = i % cols;
        return colIndex * (sqrSize + gap) + 0;
    })
    .attr("y", (d, i) => {
        let rowIndex = Math.floor(i/cols)
        return rowIndex * (sqrSize + gap) + 10;
    })
    .attr("rx", 2.2)
    .attr("fill", _.colors.dark1);

    g.selectAll(`g.${exceptionList[0]} rect:not(.container),
                g.${exceptionList[1]} rect:not(.container),
                g.${exceptionList[2]} rect:not(.container)`)
    .attr("fill", _.colors.dark2);

    g.selectAll(`g.${exceptionList[0]} text,
                g.${exceptionList[1]} text,
                g.${exceptionList[2]} text`)
    .attr("fill", _.colors.dark2);


    function changeColor(e) {
    //     exceptionList.reduce(d => )
    //    console.log(d3.select(e).attr("class").includes(""))
    }

    return {
        
    }
}

// function() {
//     if(!(exceptionList[0] || exceptionList[1] || exceptionList[2])) {
//         d3.select(this)
//         .selectAll("rect:not(.container)")
//         .attr("fill", _.colors.dark2);
//         d3.select(this).select("text")
//         .attr("fill", _.colors.dark2);
//     }


function foodco2_OnEnter(){
    console.log("Entered foodCo2!")
    //fullpage.setAutoScrolling(false);
}

function foodco2_OnLeave(direction){
    console.log("leaving foodCo2, going", direction)
}