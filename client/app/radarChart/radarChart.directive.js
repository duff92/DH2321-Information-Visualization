'use strict';

angular.module('dh2321InformationVisualizationApp')
  .directive('radarChart', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@'
      },
      link: function (scope, elem) {
        d3Service.d3().then(function(d3){

          var cfg = {
            w: 400,				//Width of the circle
            h: 250,				//Height of the circle
            margin: {top: 50, right: 20, bottom: 50, left: 20}, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 13500, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.01, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scale.category10()	//Color function
          };
          //If the supplied maxValue is smaller than the actual one, replace by the max in the data
          var maxValue = Math.max(cfg.maxValue, d3.max(scope.data, function(i){
            //.log('scope.data', scope.data);
            return d3.min(i.map(function(o){
              return o.value;
            }));
          }));
          var allAxis = (scope.data[0].map(function(i){return i.axis;})),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
            angleSlice = Math.PI * 2 / total;		//The width in radians of each 'slice'

          //Scale for the radius
          var rScale = d3.scale.linear()
            .range([0, radius])
            .domain([0, maxValue]);


          ////////////////////////////////////////
          /*console.log(d3);
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              console.log(d);
              return '<strong>' + d.axis + '</strong><span>' + d.value + '</span>';
            });*/
          //Initiate the radar chart SVG
          var svg = d3.select(elem[0])
                      .append('svg')
                      .attr('width',  cfg.w + cfg.margin.left + cfg.margin.right)
                      .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
                      .attr('class', 'radar.radarChart');

          /*var tip = d3.tip()
            .attr("class", "d3-tip")
            .html(function(d) { return d.name; });

          svg.call(tip);*/
          //////////////////////////////

          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render(scope.data);
            }
          );

          // watch for data changes and re-render
          scope.$watch('data', function(newVals) {
            //console.log(newVals);
            return scope.render(newVals);
          }, true);

          // define render function
          scope.render = function(data){
            // remove all previous items before render
            svg.selectAll('*').remove();

            //Append a g element
            var g = svg.append('g')
              .attr('transform', 'translate(' + (cfg.w/2 + cfg.margin.left) + ',' + (cfg.h/2 + cfg.margin.top) + ')');

            //Filter for the outside glow
            var filter = g.append('defs').append('filter').attr('id','glow'),
              feMerge = filter.append('feMerge');

            filter.append('feGaussianBlur').attr('stdDeviation','1').attr('result','coloredBlur');
            feMerge.append('feMergeNode').attr('in','coloredBlur');
            feMerge.append('feMergeNode').attr('in','SourceGraphic');


            //var infoText = g.append('g').attr('class', 'infoTextWrapper');

            //Wrapper for the grid & axes
            var axisGrid = g.append('g').attr('class', 'axisWrapper');

            //Draw the background circles
            axisGrid.selectAll('.levels')
              .data(d3.range(1,(cfg.levels+1)).reverse())
              .enter()
              .append('circle')
              .attr('class', 'gridCircle')
              .attr('r', function(d){return radius/cfg.levels*d;})
              .style('fill', '#CDCDCD')
              .style('stroke', '#CDCDCD')
              .style('fill-opacity', cfg.opacityCircles);
              //.style('filter' , 'url(#glow)');

            //Text indicating at what % each level is
            axisGrid.selectAll('.axisLabel')
              .data(d3.range(1,(cfg.levels+1)).reverse())
              .enter().append('text')
              .attr('class', 'axisLabel')
              .attr('x', 4)
              .attr('y', function(d){return -d*radius/cfg.levels;})
              .attr('dy', '0.4em')
              .style('font-size', '10px')
              .attr('fill', '#ffffff')
              .text(function(d) { return maxValue * d/cfg.levels; });



            ///// Draw the axis //////

            //Create the straight lines radiating outward from the center
            var axis = axisGrid.selectAll('.axis')
              .data(allAxis)
              .enter()
              .append('g')
              .attr('class', 'axis');

            //Append the lines
            axis.append('line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
              .attr('y2', function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
              .attr('class', 'line')
              .style('stroke', 'grey')
              .style('stroke-width', '2px');

            //Append the labels at each axis
            axis.append('text')
              .attr('class', 'legend')
              .style('font-size', '11px')
              .attr('text-anchor', 'middle')
              .attr('dy', '0.35em')
              .attr('x', function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
              .attr('y', function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
              .text(function(d){return d;})
              .call(wrap, cfg.wrapWidth);


            ///// Draw the radar chart blobs //////

            //The radial line function
            var radarLine = d3.svg.line.radial()
              .interpolate('linear-closed')
              .radius(function(d) { return rScale(d.value); })
              .angle(function(d,i) {	return i*angleSlice; });

            if(cfg.roundStrokes) {
              radarLine.interpolate('cardinal-closed');
            }

            //Create a wrapper for the blobs
            var blobWrapper = g.selectAll('.radarWrapper')
                  .data(data)
                  .enter().append('g')
                  .attr('class', 'radarWrapper');

            //Append the backgrounds
            blobWrapper.append('path')
                      .attr('class', 'radarArea' + scope.label)
                      .attr('d', function(d) { return radarLine(d); })
                      .style('fill', function(d,i) { return cfg.color(i); })
                      .style('fill-opacity', cfg.opacityArea)
                      .on('mouseover', function (){
                        //console.log(scope.data[i]);
                       //tip.show;
                        //Text indicating at what % each level is
                        /*infoText.selectAll('.infoTextLabel')
                          .data(scope.data[i])
                          .enter().append('text')
                          .attr('class', 'infoTextLabel')
                          .attr('x', cfg.w/5)
                          .attr('y', function(d,i){return -(cfg.h/1.5) + (i*30);})
                          .attr('dy', '0.4em')
                          .style('font-size', '0.7em')
                          .attr('fill', '#ffffff')
                          .text(function(d) { return d.axis + ': ' + d.value; });*/

                        //Dim all blobs
                        d3.selectAll('.radarArea' + scope.label)
                          .transition().duration(200)
                          .style('fill-opacity', 0.1);
                        //Bring back the hovered over blob
                        d3.select(this)
                          .transition().duration(200)
                          .style('fill-opacity', 0.7);
                      })
                      .on('mouseout', function(){
                        //tip.hide;
                        //d3.selectAll('.infoTextLabel').remove();
                        //Bring back all blobs
                        d3.selectAll('.radarArea' + scope.label)
                          .transition().duration(200)
                          .style('fill-opacity', cfg.opacityArea);
                      });

            //Create the outlines
            blobWrapper.append('path')
              .attr('class', 'radarStroke')
              .attr('d', function(d) { return radarLine(d); })
              .style('stroke-width', cfg.strokeWidth + 'px')
              .style('stroke', function(d,i) { return cfg.color(i); })
              .style('fill', 'none')
              .style('filter' , 'url(#glow)');

            //Append the circles
            blobWrapper.selectAll('.radarCircle')
              .data(function(d) { return d; })
              .enter().append('circle')
              .attr('class', 'radarCircle')
              .attr('r', cfg.dotRadius)
              .attr('cx', function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
              .attr('cy', function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
              .style('fill', function(d,i,j) { return cfg.color(j); })
              .style('fill-opacity', 0.8);
          };
          /////////////////////////////////////////////////////////
          /////////////////// Helper Function /////////////////////
          /////////////////////////////////////////////////////////

          //Taken from http://bl.ocks.org/mbostock/7555321
          //Wraps SVG text
          function wrap(text, width) {
            text.each(function() {
              var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr('y'),
                x = text.attr('x'),
                dy = parseFloat(text.attr('dy')),
                tspan = text.text(null)
                  .append('tspan')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('dy', dy + 'em')
                  .attr('fill', '#000000');

              while (words.length !== 0) {
                word = words.pop();
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  tspan.text(line.join(' '));
                  line = [word];
                  tspan = text.append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .attr('fill', '#000000')
                    .text(word);
                }
              }
            });
          }//wrap
        });
      }
    };
  }]);
