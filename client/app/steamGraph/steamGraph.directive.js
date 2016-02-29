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

          var format = d3.time.format("%m/%d/%Y");

          var margin = {top: 20, right:100, bottom: 30, left: 100};
          var width = document.body.clientWidth - margin.left - margin.right;
          var height = 400 - margin.top - margin.bottom;

          var colorrange = ["#045A8D", "#ffffff", "#B30000"];
          var tooltip = d3.select("body")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", "30px")
            .style("left", "55px");
/*
          var svg = d3.select(elem[0]).append('svg')
            .attr('width', width)
            .attr('height', height);*/

          var svg = d3.select(elem[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

            var x = d3.time.scale()
              .range([0, width]);

            var y = d3.scale.linear()
              .range([height-10, 0]);

            var z = d3.scale.ordinal()
              .range(colorrange);

            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(d3.time.month);

            var yAxis = d3.svg.axis()
              .scale(y);

            var yAxisr = d3.svg.axis()
              .scale(y);

            var stack = d3.layout.stack()
              .offset("silhouette")
              .values(function(d) { return d.values; })
              .x(function(d) { return d.date; })
              .y(function(d) { return d.clicks; });

            var nest = d3.nest().key(function(d){ return d.consumpType;});

            var area = d3.svg.area()
              .interpolate("cardinal")
              .x(function(d) { return x(d.date); })
              .y0(function(d) { return y(d.y0); })
              .y1(function(d) { return y(d.y0 + d.y); });


            scope.data.forEach(function(d){
             // console.log(d.date);
              if(typeof(d.date) !== 'object'){
                d.date = format.parse(d.date);
                d.clicks = +d.clicks;
              }
            });
            var layers = stack(nest.entries(scope.data));
            console.log(layers);

            x.domain(d3.extent(scope.data, function(d) { return d.date; }));
            y.domain([0, d3.max(scope.data, function(d) { return d.y0 + d.y; })]);

            svg.selectAll(".layer")
              .data(layers)
              .enter().append("path")
              .attr("class", "layer")
              .attr("d", function(d) { return area(d.values); })
              .style("fill", function(d, i) { return z(i); });

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(" + width + ", 0)")
              .call(yAxis.orient("right"));

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis.orient("left"));

            /*svg.selectAll(".layer")
              .attr("opacity", 1)
              .on("mouseover", function(d, i) {
                svg.selectAll(".layer").transition()
                  .duration(250)
                  .attr("opacity", function(d, j) {
                    return j != i ? 0.6 : 1;
                  })})
              .on("mousemove", function(d, i) {
                mousex = d3.mouse(this);
                mousex = mousex[0];
                var invertedx = x.invert(mousex);
                invertedx = invertedx.getMonth() + invertedx.getDate();
                var selected = (d.values);
                for (var k = 0; k < selected.length; k++) {
                  datearray[k] = selected[k].date
                  datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
                }

                mousedate = datearray.indexOf(invertedx);
                pro = d.values[mousedate].value;

                d3.select(this)
                  .classed("hover", true)
                  .attr("stroke", strokecolor)
                  .attr("stroke-width", "0.5px"),
                  tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");

              })
              .on("mouseout", function(d, i) {
                svg.selectAll(".layer")
                  .transition()
                  .duration(250)
                  .attr("opacity", "1");
                d3.select(this)
                  .classed("hover", false)
                  .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
              });*/

            var vertical = d3.select(".chart")
              .append("div")
              .attr("class", "remove")
              .style("position", "absolute")
              .style("z-index", "19")
              .style("width", "1px")
              .style("height", "380px")
              .style("top", "10px")
              .style("bottom", "30px")
              .style("left", "0px")
              .style("background", "#fff");

            /*d3.select(".chart")
              .on("mousemove", function(){
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px" )})
              .on("mouseover", function(){
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px")});*/

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
            var xAxis = d3.svg.axis()
              .scale(d3.time.scale().range([minDate,maxDate]).domain([0,width]))
              .orient("bottom")
              .ticks(d3.time.year);
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
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
