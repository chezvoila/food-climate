"use strict";

async function foodco2(data, _) {

    /***** processing data *****/

    let dataCategory = [];

    data = data.map(d => {
        return {
            food: d["Food name"],
            category: d.Category,
            sum: Object.keys(d).filter(el => ((el != "Food product") && (el != "Food name") && (el != "Category")))
            .reduce((sum,key)=>sum+parseFloat(d[key]||0),0)
        }
    });

    const categoryType =  key => [...new Set(data.map(o => o[key]))],
        categoryList = categoryType("category"),
        categoryNo = categoryList.length;

    for(let i= 0; i<= categoryNo - 1; i++) {
        dataCategory.push({
            category: categoryList[i],
            number: data.filter(el => el.category == categoryList[i]).length
        })
    }

    /***** domain & range *****/


    /***** plot data *****/
    const sqrSize = 17,
        gap = 2,
        cols = 12,
        padding = 20,
        boxH = 93,
        boxW = 227,
        outerBoxH = 118;

    let rowIndex = 0;

    let g = d3.select("#food_co2")
    .append("svg")
    // .attr("viewBox", "0 0 1142 700")
    .append("g")
    .attr("transform", "translate(0, 40)")
    .selectAll("g")
    .data(dataCategory)
    .enter()
    .append("g")
    .attr("class", d => d.category.toLowerCase())
    .attr("transform", (d, i) => {
        rowIndex = (i != 0) ? rowIndex + Math.floor(dataCategory[i - 1].number/3) + ((dataCategory[i - 1].number%3 == 0) ? 0 : 1): 0;
        let pos = (i != 0) ? rowIndex*(outerBoxH) + 290*i : 0;
        return `translate(0, ${pos})`
    });
    // .style("outline", "1px solid blue");


    g.nodes().forEach(el => {
        let className = d3.select(el).attr("class");

        d3.select(el)
        .selectAll("g")
        .data(data.filter(d => d.category == className))
        .enter().append("g")
        .attr("class", d => d.food.toLowerCase().replace(/ +/g, ""))
        .classed("figure", true)
        .attr("transform", (d, i) => {
            let rowIndex = Math.floor(i/3),
                colIndex = i%3;
            return `translate(${colIndex*(boxW + 200)}, ${rowIndex*(outerBoxH + 40) + 50})`
        })
        // .style("outline", "1px dashed #bd364c")
        // .style("cursor", "pointer")
        .on("mouseenter", function() {
            changeColor(this)
        })
        .on("mouseleave", function() {
            changeColor(this);
        })
        .append("rect")
        .classed("container", true)
        .attr("width", "246")
        .attr("height", "113")
        .attr("fill", "transparent")
        .attr("x", 0)
        .attr("y", 10)
        .attr("stroke", _.colors.icon_hover)
        .attr("stroke-width", "1px")
        .attr("stroke-dasharray", "90");
        // .style("outline", "1px solid black");


        d3.select(el).append("text")
        .text(className)
        .attr("fill", _.colors.icon_hover)
        .attr("x", 0)
        .attr("y", 0)
    });

    d3.selectAll("g.figure").nodes().forEach(el => {
        let className = d3.select(el).attr("class").replace(" figure", "");
        
        d3.select(el).selectAll("rect")
        .data(d3.range(data.filter(d => d.food.replace(/ +/g, "") == className).map(d => d.sum)))
        .enter()
        .append("rect")
        .attr("width", sqrSize)
        .attr("height", sqrSize)
        .attr("x", (d, i) => {
            let colIndex = (i - 1) % cols;
            return colIndex * (sqrSize + gap) + 0 + 10;
        })
        .attr("y", (d, i) => {
            let rowIndex = Math.floor((i - 1)/cols)
            return rowIndex * (sqrSize + gap) + 10 + 10;
        })
        .attr("rx", 2.2)
        .attr("fill", _.colors.icon_hover);

        d3.select(el)
        .append("text")
        .text(data.filter(d => d.food.replace(/ +/g, "") == className).map(d => d.food))
        .attr("fill", _.colors.icon_hover)
        .attr("x", 0)
        .attr("y", 0)
    });


    // g.selectAll(`g.${exceptionList[0]} rect:not(.container),
    //             g.${exceptionList[1]} rect:not(.container),
    //             g.${exceptionList[2]} rect:not(.container)`)
    // .attr("fill", _.colors.dark2);

    // g.selectAll(`g.${exceptionList[0]} text,
    //             g.${exceptionList[1]} text,
    //             g.${exceptionList[2]} text`)
    // .attr("fill", _.colors.dark2);


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



/********************* SCROLL ****************/

function food_co2_scroll(position) {
    console.log(position);
}