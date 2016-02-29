'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {

    this.$http = $http;

    this.d3Data2 = [
      [//iPhone
        {axis:'Battery Life',value:0.22},
        {axis:'Brand',value:0.28},
        {axis:'Contract Cost',value:0.29},
        {axis:'Design And Quality',value:0.17},
        {axis:'Have Internet Connectivity',value:0.22},
        {axis:'Large Screen',value:0.02},
        {axis:'Price Of Device',value:0.21},
        {axis:'To Be A Smartphone',value:0.50}
      ],[//Samsung
        {axis:'Battery Life',value:0.27},
        {axis:'Brand',value:0.16},
        {axis:'Contract Cost',value:0.35},
        {axis:'Design And Quality',value:0.13},
        {axis:'Have Internet Connectivity',value:0.20},
        {axis:'Large Screen',value:0.13},
        {axis:'Price Of Device',value:0.35},
        {axis:'To Be A Smartphone',value:0.38}
      ],[//Nokia Smartphone
        {axis:'Battery Life',value:0.26},
        {axis:'Brand',value:0.10},
        {axis:'Contract Cost',value:0.30},
        {axis:'Design And Quality',value:0.14},
        {axis:'Have Internet Connectivity',value:0.22},
        {axis:'Large Screen',value:0.04},
        {axis:'Price Of Device',value:0.41},
        {axis:'To Be A Smartphone',value:0.30}
      ]
    ];
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
          if(date.getFullYear() >= 2016){
            //console.log(d.Date);
            $scope.pageData.push(
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'photo',
                'clicks': parseInt(d['Daily Page consumptions by type - photo view']) || 0
              },
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'link',
                'clicks': parseInt(d['Daily Page consumptions by type - link clicks']) || 0
              },
              {
                'index': i,
                'date': d.Date,
                'consumpType': 'other',
                'clicks': parseInt(d['Daily Page consumptions by type - other clicks']) || 0
              }
            );
          }
        }
          else{
            console.log(d.Date, 'error');
          }
      });
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('dh2321InformationVisualizationApp')
  .controller('MainController', MainController);

})();
