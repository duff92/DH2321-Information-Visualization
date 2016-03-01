'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {

    this.$http = $http;

    //Parallell coordinates
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

    //Steam graph
    this.d3Data3 = [];
    let parent = this;
    $http.get('/api/things/video').success(function(data) {
      data.forEach(function(item){
        let date = new Date(item.Posted);
        let month = date.getMonth();
        let year = date.getFullYear();
        //console.log(month + ': ' + year);

        if(month === 11 && year === 2014){
          //console.log(i + ':' + item['Lifetime Post Total Impressions']);

          parent.d3Data3.push([
            {axis: 'Post Total Reach', value: item['Lifetime Post Total Reach']},
            {axis: 'Post Impressions', value: item['Lifetime Post Total Impressions']},
            {axis: 'Post Total Unique 30-sec', value: item['Lifetime Unique 30-Second Views']},
            {axis: 'Post Total Video Views', value: item['Lifetime Total Video Views']}]
          );
        }
      });
     //console.log(parent.d3Data3);
    });
    $http.get('/api/things/general').success(function(data){
      $scope.pageData = [];
      data.forEach(function(d,i){
        //console.log(i);
        var date = new Date(d.Date);
        if(date.valueOf()){
          //if(date.getFullYear() >= 2015 ){
            //console.log(d.Date);
            $scope.pageData.push(
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'Photo views',
                'clicks': parseInt(d['Daily Page consumptions by type - photo view']) || 0
              },
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'Link clicks',
                'clicks': parseInt(d['Daily Page consumptions by type - link clicks']) || 0
              },
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'Other clicks',
                'clicks': parseInt(d['Daily Page consumptions by type - other clicks']) || 0
              },
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'Unique video views',
                'clicks': parseInt(d['Daily Total Unique Video Views']) || 0
              }
            );
          //}
        }
          else{
            console.log(d.Date, 'error');
          }
      });
    });
  }

}

angular.module('dh2321InformationVisualizationApp')
  .controller('MainController', MainController);

})();
