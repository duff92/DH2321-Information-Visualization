'use strict';

angular.module('dh2321InformationVisualizationApp')
  .directive('steamGraph', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope:{
        data: '='
      },
      link: function (scope, elem) {
        d3Service.d3().then(function(d3){

          var format = d3.time.format('%m/%d/%Y');

          var margin = {top: 10, right:80, bottom: 120, left: 30},
              margin2 = {top: 410, right: 80, bottom: 30, left: 30},
              width = document.body.clientWidth - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom,
              height2 = 500 - margin2.top - margin2.bottom;

          //var colorrange = ['#393B40','#F2BE5C', '#F26A4B', '#97BF85'];
          var colorrange = ['#E34D1D','#fd8d3c', '#fecc5c', '#ffffb2'];

          var strokecolor = '#000';


          var svg = d3.select(elem[0]).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          var tooltip = d3.select(elem[0])
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
            /*.style('position', 'absolute')
            .style('z-index', '20')
            .style('visibility', 'hidden')
            .style('top', '240px')
            .style('left', '100px');*/

          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              width = document.body.clientWidth - margin.left - margin.right;
              return scope.render(scope.data);
            }
          );

          // watch for data changes and re-render
          scope.$watch('data', function(newVals) {
            //console.log('newVals',newVals);
            return scope.render(newVals);
          }, true);

          // define render function
          scope.render = function(data){
            svg.selectAll('*').remove();

            //Dimensions
            var x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.time.scale().range([height2, 0]),
                z = d3.scale.ordinal().range(colorrange),
                z2 = d3.scale.ordinal().range(colorrange);

            //Axis
            var xAxis = d3.svg.axis().scale(x).orient('bottom'),
                xAxis2 = d3.svg.axis().scale(x2).orient('bottom'),
                yAxis = d3.svg.axis().scale(y);


            var brush = d3.svg.brush().x(x2).on('brush', brushed);


            var stack = d3.layout.stack()
              .offset('silhouette')
              .values(function(d) { return d.values; })
              .x(function(d) { return d.date; })
              .y(function(d) { return d.clicks; });

            var nest = d3.nest().key(function(d){ return d.consumpType;});

            var area = d3.svg.area()
              .interpolate('cardinal')
              .x(function(d) { return x(d.date); })
              .y0(function(d) { return y(d.y0); })
              .y1(function(d) { return y(d.y0 + d.y); });

            var area2 = d3.svg.area()
              .interpolate('cardinal')
              .x(function(d) { return x2(d.date); })
              .y0(function(d) { return y2(d.y0); })
              .y1(function(d) { return y2(d.y0 + d.y); });

            svg.append('defs').append('clipPath')
              .attr('id', 'clip')
              .append('rect')
              .attr('width', width)
              .attr('height', height);

            var focus = svg.append('g')
              .attr('class', 'focus')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var context = svg.append('g')
              .attr('class', 'context')
              .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

            data.forEach(function(d){
             // console.log(d.date);
              if(typeof(d.date) !== 'object'){
                d.date = format.parse(d.date);
                d.clicks = +d.clicks;
              }
            });
            var layers = stack(nest.entries(data));
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());


            focus.selectAll('.area')
              .data(layers)
              .enter().append('path')
              .attr('class', 'area')
              .attr('d', function(d) {return area(d.values);})
              .style('fill', function(d, i){return z(i);});

            focus.append('g')
              .attr('class', 'x axis')
              .style('fill', 'white')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

            focus.append('g')
              .attr('class', 'y axis')
              .style('fill', 'white')
              .call(yAxis.orient('left'));

            //Context of graph below
            context.selectAll('.area')
              .data(layers)
              .enter().append('path')
              .attr('class', 'area')
              .attr('d', function(d) {return area2(d.values);})
              .style('fill', function(d, i){return z2(i);});

            context.append('g')
              .attr('class', 'x axis')
              .style('fill', 'white')
              .attr('transform', 'translate(0,' + height2 + ')')
              .call(xAxis2);

            context.append('g')
              .attr('class', 'x brush')
              .call(brush)
              .selectAll('rect')
              .attr('y', -6)
              .attr('height', height2 + 7);

            //Activeted when data is being filtered using the brush
            function brushed() {
              x.domain(brush.empty() ? x2.domain() : brush.extent());
              var dataFiltered = data.filter(function(d) {
                if ( (d.date >= x.domain()[0]) && (d.date <= x.domain()[1]) ) {
                  return d;
                }
              });

              dataFiltered.forEach(function(d){
                // console.log(d.date);
                if(typeof(d.date) !== 'object'){
                  d.date = format.parse(d.date);
                  d.clicks = +d.clicks;
                }
              });
              var layers2 = stack(nest.entries(dataFiltered));

              x.domain(d3.extent(dataFiltered, function(d) { return d.date; }));
              y.domain([0, d3.max(dataFiltered, function(d) { return d.y0 + d.y; })]);

              focus.selectAll('.area').remove();
              focus.selectAll('.area')
                .data(layers2)
                .enter().append('path')
                .attr('class', 'area')
                .attr('d', function(d) {return area(d.values);})
                .style('fill', function(d, i){return z(i);});

              focus.select('.x.axis').call(xAxis);
              focus.select('.y.axis').call(yAxis.orient('left'));

              var datearray = [];
              var clicks, time;
              focus.selectAll('.area')
                .attr('opacity', 1)
                .on('mouseover', function(d, i) {
                  focus.selectAll('.area').transition()
                    .duration(250)
                    .attr('opacity', function(d, j) {
                      return j !== i ? 0.25 : 1;
                    });})
                .on('mousemove', function(d) {
                  var mousex = d3.mouse(this);
                  mousex = mousex[0];
                  var invertedx = x.invert(mousex);
                  invertedx = invertedx.getMonth() + invertedx.getDate();
                  var selected = (d.values);
                  for (var k = 0; k < selected.length; k++) {
                    datearray[k] = selected[k].date;
                    datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
                    // console.log(selected[k].date.getMonth());
                  }

                  var mousedate = datearray.indexOf(invertedx);
                  var formatTime = d3.time.format('%e %B');

                  clicks = d.values[mousedate].clicks.toString();
                  time = formatTime(d.values[mousedate].date);

                  d3.select(this)
                    .classed('hover', true)
                    .attr('stroke', strokecolor)
                    .attr('stroke-width', '1px');

                  var positionSteamGraph = $(elem[0]).position();

                  tooltip.transition().duration(100).style('opacity', 0.75);
                  tooltip.html('<p>' + '<b>Type:</b>' + d.key + '<br>'  + '<b>Value: </b>' + clicks + '<br>' + '<b>Date: </b>' + time + '</p>')
                    .style('left', (positionSteamGraph.left + margin.left + 40) + 'px')
                    .style('top', (positionSteamGraph.top - height - height2 - 35) + 'px');


                })
                .on('mouseout', function() {
                  focus.selectAll('.area')
                    .transition()
                    .duration(250)
                    .attr('opacity', '1');
                  d3.select(this)
                    .classed('hover', false)
                    .attr('stroke-width', '0px');

                  tooltip.transition().duration(100).style('opacity', 0);
                });

              d3.select('.vertical').remove();
              var vertical = d3.select(elem[0])
                .append('div')
                .attr('class', 'vertical')
                .style('position', 'absolute')
                .style('z-index', '19')
                .style('width', '1px')
                .style('height', height + 'px')
                .style('top', (margin2.top - margin2.bottom - margin.bottom - 31) + 'px')
                .style('left', '0px')
                .style('background', '#666');

              d3.select(elem[0])
                .on('mousemove', function(){
                  var mousex = d3.mouse(this);
                  mousex = mousex[0] + 3;
                  vertical.attr('fill', 'white').style('left', (mousex) + 'px' );})
                .on('mouseover', function(){
                  var mousex = d3.mouse(this);
                  mousex = mousex[0] + 3;
                  vertical.attr('fill', 'white').style('left',(mousex) + 'px');
                });


            }
          };


        });
      }
    };
  }]);
