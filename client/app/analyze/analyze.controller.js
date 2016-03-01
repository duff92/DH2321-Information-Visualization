'use strict';

angular.module('dh2321InformationVisualizationApp')
  .controller('AnalyzeCtrl', function ($scope, $http, $window) {
    //Parallell coordinates
    $scope.selectedData = [];
    $scope.api;
    $scope.options = {
      'chart': {
        'type': 'parallelCoordinates',
        'width': document.body.clientWidth,
        'height': 450,
        'margin': {
          'top': 30,
          'right': 20,
          'bottom': 10,
          'left': 20
        },
        color: d3.scale.category10().range(),
        'dimensionNames': [
          'Lifetime Post Total Reach',
          'Lifetime Post Total Impressions',
          'Lifetime Post Consumptions',
          'Lifetime Post reach by people who like your Page'
        ],
        dispatch: {
          stateChange: function(e){ console.log('stateChange'); },
          brushstart: function(e) {console.log('brush start');},
          brush: function(e) {console.log('brush');},
          brushEnd: function(e) {
            $scope.selectedData = [];
            e.forEach(function(d){
              $scope.selectedData.push(d.values);
            });
            console.log('brush end', $scope.selectedData);
            $scope.$apply();
          }
        }
      }
    };
    /*$scope.initData = [
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
    ];*/
    $(window).resize(function() {
      $scope.$apply(function(){
        $scope.options.chart.width = document.body.clientWidth;
        setTimeout(function(){
          $scope.api.updateWithOptions($scope.options);
        })
      });
    });
    $http.get('/api/things/posts').success(function(data){
      $scope.postData = [];
      data.forEach(function(d){
          $scope.postData.push(
            {
              'Type': d.Type,
              'Permalink': d.Permalink,
              'Post Message': d['Post Message'],
              'Posted': d.Posted,
              'Lifetime Post Total Reach': d['Lifetime Post Total Reach'],
              'Lifetime Post Total Impressions': d['Lifetime Post Total Impressions'],
              'Lifetime Post Consumptions': d['Lifetime Post Consumptions'],
              'Lifetime Post reach by people who like your Page': d['Lifetime Post reach by people who like your Page']
            }
          );
      });
      $scope.data = angular.copy($scope.postData);
    });
    $scope.checkboxes = {};

    $scope.onchange = function(){
      $scope.data = [];
      angular.forEach($scope.postData, function(value){
        if ($scope.checkboxes[value.name]) {
          $scope.data.push(value);
        }
      });
    };
  });
