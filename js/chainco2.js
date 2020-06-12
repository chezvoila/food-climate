"use strict";

/**
 * base function to initialize this visualization
 *
 * @param data            The complete data necessary to this viz.
 *
 */
async function chainco2(data) {
    
    //Define the size of the svg element
    let sizeSettings = { width: document.documentElement.clientWidth,
                         height: document.documentElement.clientHeight }
    
    //Initialize the svg element
    let svg = d3.select("#chain_co2").append("svg")
    .attr("width", sizeSettings.width)
    .attr("height", sizeSettings.height);

    //define the settings for the donut chart. It will auto-adjust
    const donutSettings = {position: { x: sizeSettings.width / 2, 
                                y: 0.95*sizeSettings.height },
                    radius: sizeSettings.width / 5 ,
                    thickness: sizeSettings.width / 15 }  
    
    //draw the highlighted background when second level is discovered
    drawScope(svg, donutSettings, data)
    
    //draw the visualization title
    const title = {text: "The food CO2 emissions",
                   position: { x: sizeSettings.width/2, 
                               y: sizeSettings.height/5 }
                  }
    drawTitle(svg, title);
    
    //define tooltip
    let tip = d3.tip()
                .attr("class", "d3-tip")
                .html(function(d) { return d.value*100+"%"; });

    //define the group that will be used to draw the donut chart
    let g = svg.append("g")
                .attr("transform", `translate(${donutSettings.position.x}, ${donutSettings.position.y})`)
                .call(tip)
    
    //draw level 1 with specified angles settings
    const anglesLevel1 = {
        startAngle: -Math.PI/2,
        endAngle: Math.PI/2
    }
    plotLevel(g, donutSettings, anglesLevel1, 1, data.level1, tip)
    
    //draw level 2 with specified angles settings
    const anglesLevel2 = {
        startAngle: -Math.PI/2,
        endAngle: -Math.PI/2+Math.PI*data.level1[0].v
    }
    plotLevel(g, donutSettings, anglesLevel2, 2, data.level2, tip)

    //draw the dashed line
    drawSeparatingLine(svg, donutSettings, data);
}

/**
 * Creates a level on the multilevel donut chart
 *
 * @param g               The SVG group in which the level has to be drawn.
 * @param settings        The settings object containing position, base radius and thickness.
 * @param angles          The angles object specifying the startAngle and endAngle.
 * @param level           The level number starting from level 1 as the base level.
 * @param data            The data from this specific level. (data.levelx)
 * @param tip             The D3 tooltip to display information
 *
 */
function plotLevel(g, settings, angles, level, data, tip){
    
    //Define the color scale
    let color = d3.scaleOrdinal();
    color.domain(data.map((_,i) => i))
    color.range(data.map(d => d.color))

    //d3 define pie function for angles calculation
    let pies = d3.pie()
    	         .value( d => d)
                 .sort(null)
                 .startAngle(angles.startAngle)
                 .endAngle( angles.endAngle)
    
    //d3 define arc function
    const radius = level > 1 ? settings.radius*(1.8*(level-1)) : settings.radius;
	let arc = d3.arc()
    	        .outerRadius(radius)
                .innerRadius(radius - settings.thickness)

    //define groups to draw the text and the path inside
    let groups = g.selectAll(`g.level${level}`)
                  .data(pies(data.map(d => d.v)))
                  .enter()
                  .append("g")
                  .classed(`level${level}`, true)

    //draw the arcs on the donut chart
    groups.append("path")
          .attr("id", (_,i) => `level${level}_${i}`)
          .attr("fill", d => color(d.index))
          .attr("d", arc)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)

    //add the text on the arc
    groups.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr("dx", 20)
          .attr("dy", -15)
          .append("textPath")
          .classed("text", true)
          .attr("xlink:href", (_,i) => `#level${level}_${i}`) 
          .text(d => d.name)
          .classed("donutLabel", true)
}

/**
 * Creates the background for higlighting the second level.
 *
 * @param svg             The SVG element in which the background has to be drawn.
 * @param settings        The settings object containing position, base radius and thickness.
 * @param data            The data to compute angles.
 *
 */
function drawScope(svg, settings, data){
    //compute the angle of the donut chart
    const tanAngle = Math.tan(Math.PI*data.level1[0].v);

    //define the points and the path command associated with
    const points = [
        {
            cmd: "M", 
            x: 0, 
            y: settings.position.y - tanAngle*settings.position.x
        },
        {
            cmd: "L", 
            x: 0, 
            y: settings.position.y},
        {   cmd: "L", 
            x: settings.position.x-settings.radius, 
            y: settings.position.y
        },
        {
            cmd: "L", 
            x: settings.position.x-settings.radius+settings.thickness, 
            y: settings.position.y - tanAngle*(settings.radius-settings.thickness) 
        }
   ]

   //draw the background using the specified points
    svg.append("path")
    .attr("d", points.reduce((path, actual) => path + `${actual.cmd}${actual.x}  ${actual.y}`, "") +"Z")
    .classed("highlightedBackground", true)
}

/**
 * Draws a dash line that extends from the first level towards the 
 * left side of the chart using the second level angle.
 *
 * @param svg             The SVG element in which the background has to be drawn.
 * @param settings        The settings object containing position, base radius and thickness.
 * @param data            The data to compute angles.
 *
 */
function drawSeparatingLine(svg, settings, data){
    const angle = Math.PI*data.level1[0].v*data.level2[0].v;
    const tanAngle = Math.tan(angle);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const linePoints = [
        {
            x: 0, 
            y: settings.position.y - tanAngle*settings.position.x
        },
        {
            x: settings.position.x-cosAngle*(settings.radius-settings.thickness), 
            y: settings.position.y - sinAngle*(settings.radius-settings.thickness)}
   ]

    svg.append("line")
       .attr("x1", linePoints[0].x)
       .attr("y1", linePoints[0].y)
       .attr("x2", linePoints[1].x)
       .attr("y2", linePoints[1].y)
       .attr("stroke-dasharray", 4)
       .attr("stroke-width", 2)
       .attr("stroke", "#6b101f")
}

/**
 * function that adds the title on the svg element
 *
 * @param svg             The SVG element in which the title has to be drawn.
 * @param title           An object that contains the title settings and text
 *
 */
function drawTitle(svg, title){
    svg.append("text")
       .attr("x", title.position.x)
       .attr("y", title.position.y)
       .attr("text-anchor", "middle")
       .classed("title", true)
       .text(title.text)
}