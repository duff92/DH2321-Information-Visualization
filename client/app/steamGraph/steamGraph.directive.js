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

          var colorrange = ['#393B40','#F2BE5C', '#F26A4B', '#97BF85'];
          var strokecolor = '#000';


          var svg = d3.select(elem[0]).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          var tooltip = d3.select(elem[0])
            .append('div')
            .attr('class', 'remove')
            .style('position', 'absolute')
            .style('z-index', '20')
            .style('visibility', 'hidden')
            .style('top', '200px')
            .style('left', '100px');

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
            console.log(layers);
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
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

            focus.append('g')
              .attr('class', 'y axis')
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

              console.log(dataFiltered);
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
              var pro;
              focus.selectAll('.area')
                .attr('opacity', 1)
                .on('mouseover', function(d, i) {
                  focus.selectAll('.area').transition()
                    .duration(250)
                    .attr('opacity', function(d, j) {
                      return j !== i ? 0.3 : 1;
                    });})
                .on('mousemove', function(d) {
                  console.log(d);
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
                  pro = d.values[mousedate].clicks.toString();

                  d3.select(this)
                    .classed('hover', true)
                    .attr('stroke', strokecolor)
                    .attr('stroke-width', '1px');
                  tooltip.html( '<p class="lead">' + d.key + '<br>' + pro + '</p>' ).style('visibility', 'visible');

                })
                .on('mouseout', function(d) {
                  focus.selectAll('.area')
                    .transition()
                    .duration(250)
                    .attr('opacity', '1');
                  d3.select(this)
                    .classed('hover', false)
                    .attr('stroke-width', '0px');
                  tooltip.html( '<p>' + d.key + '<br>' + pro + '</p>' ).style('visibility', 'hidden');
                });

            }
           /* d3.select('.remove').remove();
            var vertical = d3.select(elem[0])
              .append('div')
              .attr('class', 'remove')
              .style('position', 'absolute')
              .style('z-index', '19')
              .style('width', '1px')
              .style('height', '380px')
              .style('top', '185px')
              .style('bottom', '0px')
              .style('left', '100px')
              .style('background', '#000');

            d3.select(elem[0])
              .on('mousemove', function(){
                var mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.attr('fill', 'black').style('left', mousex + 'px' )})
              .on('mouseover', function(){
                var mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.attr('fill', 'black').style('left', mousex + 'px')});*/

           /* var dataToUse = [];
            var minDate = new Date();
            var maxDate = new Date(0);
            console.log(data.length);
            data.forEach(function(d,i){
              dataToUse.push(d);
              if(typeof(d.date) === 'object'){
                dataToUse[i].date = d.date;
              }
              else {
                dataToUse[i].date = d3.time.format('%m/%d/%Y').parse(d.date);
              }
              dataToUse[i].y = +d.clicks;
              dataToUse[i].x = +d.index;
              if(d.date.getTime() < minDate.getTime()){
                minDate = d.date;
              }
              if(d.date.getTime() > maxDate.getTime()){
                maxDate = d.date
              }

              //console.log(typeof(dataToUse[i].date));
            });
            //console.log(dataToUse);

              stack = d3.layout.stack().offset('wiggle').values(function(d){ return d.values;}),
              layers0 = stack(nest.entries(dataToUse)),
              layers1 = stack(nest.entries(dataToUse));

            var m = layers0[0].values.length;

            var yDomain = d3.max(layers0.concat(layers1), function(layer) {
              return d3.max(layer.values,
                function(d) {
                  //console.log(d);
                  return d.y0 + d.y;
                });
            });*/
          };


        });
      }
    };
  }]);
