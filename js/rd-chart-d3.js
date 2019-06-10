              /* Set-Up */
              var color= d3.schemeCategory20b;
              
            var margin = {top: 120, right: 120, bottom: 120, left: 120},
                width = Math.min(900, window.innerWidth - 10) - margin.left - margin.right,
                height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
            
                
            

            /* Data */
            
            d3.json("data/dataset.json", function(data) {
             
            var data1=[]
            for(i=0; i<data.length; i++){
                data1[i]=d3.entries(data[i]);
            }

            /* Draw the Chart */
            
            var color= d3.schemeCategory20b;
                            
            var radarChartOptions = {
              w: width,
              h: height,
              margin: margin,
              maxValue: 1, 
              levels: 5,
              roundStrokes: true, //true se li voglio arrotondati
              color: color
            };
            /*Call function to draw the Radar chart */
            RadarChart(".radarChart", data1, radarChartOptions);
        });
        
