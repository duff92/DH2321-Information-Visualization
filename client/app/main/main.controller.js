'use strict';

(function() {

class MainController {

  constructor($http, $scope) {

    this.$http = $http;

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
