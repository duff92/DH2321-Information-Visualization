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
          if(!scope.data){
            return;
          }
          var width =1000,
            height = 500;
          var svg = d3.select(elem[0]).append('svg')
            .attr('width', width)
            .attr('height', height);

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
            //console.log('newVals',newVals);
            return scope.render(newVals);
          }, true);

          // define render function
          scope.render = function(data){
            svg.selectAll('*').remove();
            var dataToUse = [];
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
            var nest = d3.nest().key(function(d){ return d.consumpType;}),
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
            });


            var x = d3.scale.linear()
              .domain([0, m - 1])
              .range([0, width]);



            var y = d3.scale.linear()
              .domain([0, yDomain])
              .range([height, 0]);

            //Color scale (linear interpolation) of steam graph
            var color = d3.scale.linear()
              .range(['#aad', '#556']);

            var area = d3.svg.area()
              .x(
                function(d) {
                  return x(d.x);
                })
              .y0(function(d) {
                return y(d.y0);
              })
              .y1(function(d) {
                return y(d.y0 + d.y);
              });

            svg.selectAll('path')
              .data(layers0)
              .enter().append('path')
              .attr('d', function(d) { return area(d.values); })
              .style('fill', function() { return color(Math.random()); });
            /*var xAxis = d3.svg.axis()
              .scale(d3.time.scale().domain([minDate, maxDate]).range([0, width]))
              .orient("bottom");
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (height-30) + ")")
              .call(xAxis);*/
          };






          /*function transition() {
            d3.selectAll('path')
              .data(function() {
                var d = layers1;
                layers1 = layers0;
                return layers0 = d;
              })
              .transition()
              .duration(2500)
              .attr('d', area);
          }*/
        });
      }
    };
  }]);
