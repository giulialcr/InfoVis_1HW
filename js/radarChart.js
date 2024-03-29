function RadarChart(id, data, options) {
    var cfg = {
     w: 700,                //Width of the circle
     h: 700,                //Height of the circle
     margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
     levels: 3,                //How many levels or inner circles should there be drawn
     maxValue: 0,             //What is the value that the biggest circle will represent
     labelFactor: 1.25,     //How much farther than the radius of the outer circle should the labels be placed
     wrapWidth: 60,         //The number of pixels after which a label needs to be given a new line
     opacityArea: 0.35,     //The opacity of the area of the blob
     dotRadius: 4,             //The size of the colored circles of each blog
     opacityCircles: 0.1,     //The opacity of the circles of each blob
     strokeWidth: 2,         //The width of the stroke around each blob
     roundStrokes: false,    //If true the area and stroke will follow a round path (cardinal-closed)
     color: d3.scale.category10()    //Color function
    };
    var offset = 0;
    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
      }//for i
    }//if
    
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        //var allAxis = (data[0].map(function(i, j){return i.axis})),
    var allAxis = (data[0].map(function(i){return i.key})),    //Names of each axis
        total = allAxis.length,                    //The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2),     //Radius of the outermost circle
        Format = d3.format('%'),                 //Percentage formatting
        angleSlice = Math.PI * 2 / total;        //The width in radians of each "slice"
    
    //Scale for the radius
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);
        
    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();
    
    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
            .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
            .attr("class", "radar"+id);
    //Append a g element        
    var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");
    
    //Draw the background circles
    axisGrid.selectAll(".levels")
       .data(d3.range(1,(cfg.levels+1)).reverse())
       .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles);

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
       .data(d3.range(1,(cfg.levels+1)).reverse())
       .enter().append("text")
       .attr("class", "axisLabel")
       .attr("x", 4)
       .attr("y", function(d){return -d*radius/cfg.levels;})
       .attr("dy", "0.4em")
       .style("font-size", "2vmin")
       .attr("fill", "#737373")
       .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////
    var arpos = [];
    for (var i = 0; i < total; i++) {
        arpos.push(i);
    }
    
    //var arpos=[0,1,2,3,4];
    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis")
        .attr('id', function(d,i){return i})
          .on('click', function (d,i){      //definition of onclick, the selected axis goes to first position and the rest rotate
                     
            
            var iterat=arpos.indexOf(i);
            if(iterat != 0){      //yes only the selected axis is not the first
          
            for(j=0; j<iterat; j++){ 
            
                offset+=angleSlice;
                arpos.push(arpos.shift());

                
            axis.select(".legend").transition().duration(2000).attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i  - Math.PI/2 - offset); }).attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i  - Math.PI/2 - offset); })
            axis.select(".line").transition().duration(2000).attr('transform', 'rotate('+(-offset*180/Math.PI) + ')')

            blobWrapper.select(".radarArea").transition().duration(2000).attr('transform', 'rotate('+(-offset*180/Math.PI) + ')')
            blobWrapper.select(".radarStroke").transition().duration(2000).attr('transform', 'rotate('+(-offset*180/Math.PI) + ')')
        
            d3.selectAll(".radarInvisibleCircle").transition().duration(2000).attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i  - Math.PI/2 - offset); }).transition().attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i  - Math.PI/2 - offset); })
            d3.selectAll(".radarCircle").transition().duration(2000).attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i  - Math.PI/2 - offset); }).attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i  - Math.PI/2 - offset); })
         } }
              }) 
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".axis")
                .transition().duration(700)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(500)
                .style("fill-opacity", 0.7);    
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".axis")
                .transition().duration(1000)
                .style("fill-opacity", 1);
            });
        
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2 - offset); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2 - offset); })
        .attr("class", "line")
        .style("stroke", "#808080")
        //.style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "2vmin")
        // .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2- offset); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2- offset); })
        .text(function(d){return d})
        //.call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    
    //The radial line function
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {    return i*angleSlice- offset; });
        
    if(cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }
                
    //Create a wrapper for the blobs    
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr('id', function(d,i){return "rd"+i})
        .attr("class", "radarWrapper");
            
    //Append the backgrounds    
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(800)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(800)
                .style("fill-opacity", 0.7);    
        })
         .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        }) ;
        
    //Create the outlines    
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none");        
    
    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2- offset); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2- offset); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
        
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2- offset); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2- offset); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                    
            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });
        
    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
    

// This function is gonna change the opacity of selected and unselected data
function update(){

    // For each check box:
    d3.selectAll(".checkbox").each(function(d){
      cb = d3.select(this);
      grp = cb.property("value")

      // If the box is check, I show the data
      if(cb.property("checked")){
        d3.selectAll("#rd"+grp).transition().duration(1000).style("opacity", 1)

      // Otherwise I hide it
      }else{
        d3.selectAll("#rd"+grp).transition().duration(1000).style("opacity", 0)
      }
    })
  }

  // When a button change, I run the update function
  d3.selectAll(".checkbox").on("change",update);

  // And I initialize it at the beginning
  update()
    
}//RadarChart
