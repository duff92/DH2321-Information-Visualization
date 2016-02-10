'use strict';

/**
 * @ngdoc function
 * @name dh2321InformationVisualizationApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dh2321InformationVisualizationApp
 */
angular.module('dh2321InformationVisualizationApp')
  .controller('MainCtrl', function ($scope) {
    $scope.options = {
     'chart': {
     'type': 'parallelCoordinates',
     'height': 450,
     'margin': {
       'top': 30,
       'right': 20,
       'bottom': 10,
       'left': 20
     },
       color: d3.scale.category10().range(),
     'dimensionNames': [
     'Feeling of happiness',
     'State of health (subjective)',
     'Satisfaction with your life',
     'Science and technology (health)',
     'Total health spending (% of GDP)',
     'Total health spending per person ($)'
     ],
       dispatch: {
         stateChange: function(e){ console.log('stateChange'); },
         brushstart: function(e) {console.log('brush start');},
         brush: function(e) {console.log('brush');},
         brushEnd: function(e) {console.log('brush end');}
       }
     }
     };

     $scope.initData = [
     {
     'name': 'Chile',
       'color': '#1f77b4',
     'Feeling of happiness': '3.08',
     'State of health (subjective)': '2.88',
     'Satisfaction with your life': '7.27',
     'Science and technology (health)': '7.01',
     'Total health spending (% of GDP)': '8.0',
     'Total health spending per person ($)': '947.22'
     },
       {
         'name': 'China',
         'color': '#ff7f0e',
         'Feeling of happiness': '3.00',
         'State of health (subjective)': '2.87',
         'Satisfaction with your life': '6.85',
         'Science and technology (health)': '8.33',
         'Total health spending (% of GDP)': '5.1',
         'Total health spending per person ($)': '220.88'
       },
       {
         'name': 'South Korea',
         'color': '#2ca02c',
         'Feeling of happiness': '3.05',
         'State of health (subjective)': '2.95',
         'Satisfaction with your life': '6.51',
         'Science and technology (health)': '7.42',
         'Total health spending (% of GDP)': '6.9',
         'Total health spending per person ($)': '1438.78'
       },
       {
         'name': 'Rwanda',
         'color': '#9467bd',
         'Feeling of happiness': '3.3',
         'State of health (subjective)': '3.13',
         'Satisfaction with your life': '6.47',
         'Science and technology (health)': '8.72',
         'Total health spending (% of GDP)': '10.5',
         'Total health spending per person ($)': '55.51'
       },
       {
         'name': 'Sweden',
         'color': '#8c564b',
         'Feeling of happiness': '3.35',
         'State of health (subjective)': '3.03',
         'Satisfaction with your life': '7.55',
         'Science and technology (health)': '7.54',
         'Total health spending (% of GDP)': '9.63',
         'Total health spending per person ($)': '4710.43'
       },
       {
         'name': 'United States',
         'color': '#e377c2',
         'Feeling of happiness': '3.25',
         'State of health (subjective)': '3.05',
         'Satisfaction with your life': '7.37',
         'Science and technology (health)': '7.19',
         'Total health spending (% of GDP)': '17.89',
         'Total health spending per person ($)': '8361.73'
       }
     ];

    $scope.data = angular.copy($scope.initData);

    $scope.checkboxes = {};

    $scope.onchange = function(){
      $scope.data = [];
      angular.forEach($scope.initData, function(value){
        if ($scope.checkboxes[value.name]) {
          $scope.data.push(value);
        }
      });
    };
  });
