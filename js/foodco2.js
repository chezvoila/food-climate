"use strict";

async function foodco2(data, _, res) {

    /***** processing data *****/

    let dataCategory = [];
    if (res.length != 0) {
        hightlight(res);
        return
    }
    data = data.map(d => {
        return {
            food: d["Food name"],
            id: d.id,
            category: d.Category,
            sum: Object.keys(d).filter(el => ((el != "Food product") && (el != "Food name") && (el != "Category") && (el != "id")))
                .reduce((sum, key) => sum + parseFloat(d[key] || 0), 0)
        }
    });

    const categoryType = key => [...new Set(data.map(o => o[key]))],
        categoryList = categoryType("category"),
        categoryNo = categoryList.length;

    for (let i = 0; i < categoryNo; i++) {
        dataCategory.push({
            category: categoryList[i],
            number: data.filter(el => el.category == categoryList[i]).length
        })
    }

    /***** domain & range *****/


    /***** plot data *****/
    const sqrSize = 17,
        gap = 2,
        // cols = 12,
        padding = 20,
        boxH = 93,
        boxW = 160,
        outerBoxH = 120;
    let cols = 12;

    let rowIndex = 0;

    let g = d3.select("#food_co2")
        .append("svg")
        .attr("width", 1107)
        .attr("viewBox", "0 0 1107 3500")
        .append("g")
        .attr("transform", "translate(60, 40)")
        .selectAll("g.other")
        .data(dataCategory)
        .enter()
        .append("g")
        .attr("class", d => d.category.toLowerCase())
        .attr("transform", (d, i) => {
            rowIndex = (i != 0) ? rowIndex + Math.floor(dataCategory[i - 1].number / 3) + ((dataCategory[i - 1].number % 3 == 0) ? 0 : 1) : 0;
            let pos = (i != 0) ? rowIndex * (outerBoxH) + 290 * i : 0;
            return `translate(0, ${pos})`
        });
    // .style("outline", "1px solid blue");


    g.nodes().forEach(el => {
        let className = d3.select(el).attr("class");
        // ordering of the elements from big to small
        var data_class = data.filter(d => d.category == className).sort((a, b) => b.sum - a.sum)
        d3.select(el)
            .selectAll("g")
            .data(data_class)
            .enter().append("g")
            .attr('id', d => d.id)
            .attr("class", d => d.food.toLowerCase().replace(/ +/g, ""))
            .classed("figure", true)
            .attr("transform", (d, i) => {
                if (className == "meat" && i > 0) i++;
                let rowIndex = Math.floor(i / 3),
                    colIndex = i % 3;
                return `translate(${colIndex * (boxW + 200)}, ${rowIndex * (outerBoxH + 40) + 50})`
            })
            .on("mouseenter", function () {
                changeColor(this)
            })
            .on("mouseleave", function () {
                changeColor(this);
            })


        d3.select(el).append("text")
            .text(className)
            .attr("fill", _.colors.light2)
            .attr("x", 0)
            .attr("y", 0)
    });


    d3.selectAll("g.figure").nodes().forEach(el => {
        let className = d3.select(el).attr("class").replace(" figure", "");
        if (className == 'beef(meatcows)') cols = 32;
        else cols = 12;

        d3.select(el).selectAll("rect")
            .data(d3.range(data.filter(d => d.food.replace(/ +/g, "") == className).map(d => d.sum * 2.9)))
            .enter()
            .append("rect")
            .attr("width", sqrSize)
            .attr("height", sqrSize)
            .attr("x", (d, i) => {
                let colIndex = (i - 1) % cols;
                return colIndex * (sqrSize + gap);
            })
            .attr("y", (d, i) => {
                let rowIndex = Math.floor((i - 1) / cols)
                return rowIndex * (sqrSize + gap) + 10 + 10;
            })
            .attr("rx", 2.2)
            .attr("fill", _.colors.light2)
            .attr("opacity", 0);

        d3.select(el)
            .append("text")
            .text(() => {
                return data.filter(d => d.food.replace(/ +/g, "") == className).map(d => d.food)
                    + " ( " + data.filter(d => d.food.replace(/ +/g, "") == className).map(d => d.sum.toFixed(2)) + " kg )"
            })
            .attr("fill", _.colors.light2)
            .attr("x", 0)
            .attr("y", 0)
    });

    return {

    }
}

function hightlight(res) {
    d3.selectAll('.highlight').classed('highlight', false);
    res.forEach(id => {
        d3.select('#' + id).classed('highlight', true);
    })
}

/********************* SCROLL ****************/

function food_co2_scroll(position) {
    if (position > 0) {
        d3.selectAll("#food_co2 rect:not(:first-child)")
            .transition()
            .duration(200)
            .delay((d, i) => i * 5)
            // .delay((d, i) => i * 15)
            .attr("opacity", 1);
    }
}