'use strict';

(function() {

class MainController {

  constructor($http, $scope) {

    this.$http = $http;
    /*this.alchemyAPIKeywords = [
      {
        'value': '0.965375',
        'key': 'Visualization Studio VIC'
      },
      {
        'value': '0.674053',
        'key': 'KTH Royal Institute'
      },
      {
        'value': '0.617289',
        'key': 'advanced graphics'
      },
      {
        'value': '0.597319',
        'key': 'virtual reality'
      },
      {
        'value': '0.545232',
        'key': 'open house'
      },
      {
        'value': '0.543144',
        'key': 'information visualization'
      },
      {
        'value': '0.530511',
        'key': 'information visualization students'
      },
      {
        'value': '0.526204',
        'key': 'Comic Con Stockholm'
      },
      {
        'value': '0.512843',
        'key': 'Studio VIC students'
      },
      {
        'value': '0.512541',
        'key': 'game design course'
      },
      {
        'value': '0.502809',
        'key': 'Information Visualization course'
      },
      {
        'value': '0.494163',
        'key': 'undefined Visualization Studio'
      },
      {
        'value': '0.487629',
        'key': 'cover photo'
      },
      {
        'value': '0.479872',
        'key': 'SeRC Visualization Studio'
      },
      {
        'value': '0.475852',
        'key': 'Studio VIC history'
      },
      {
        'value': '0.473444',
        'key': 'Bang Visualization Studio'
      },
      {
        'value': '0.473361',
        'key': 'Friends Arena'
      },
      {
        'value': '0.473303',
        'key': 'interaction students'
      },
      {
        'value': '0.47191',
        'key': 'Studio VIC project'
      },
      {
        'value': '0.471019',
        'key': 'information visualization student'
      },
      {
        'value': '0.470308',
        'key': 'director Björn Thuresson'
      },
      {
        'value': '0.468032',
        'key': 'Visualization Literacy workshop'
      },
      {
        'value': '0.466578',
        'key': 'wikidata visualization challenge'
      },
      {
        'value': '0.464794',
        'key': 'students discussing project'
      },
      {
        'value': '0.46438',
        'key': 'MS Thesis Defense'
      },
      {
        'value': '0.461423',
        'key': 'virtual-reality molecule visualization'
      },
      {
        'value': '0.460289',
        'key': 'successful Open House'
      },
      {
        'value': '0.459169',
        'key': 'great visualization conference'
      },
      {
        'value': '0.458939',
        'key': 'student project'
      },
      {
        'value': '0.458672',
        'key': 'KTH central news'
      },
      {
        'value': '0.458418',
        'key': 'game design students'
      },
      {
        'value': '0.458028',
        'key': 'KTH students'
      },
      {
        'value': '0.457585',
        'key': 'Interaction AGI14 students'
      },
      {
        'value': '0.456816',
        'key': 'studio director Björn'
      },
      {
        'value': '0.456705',
        'key': 'visualization screen'
      },
      {
        'value': '0.455514',
        'key': 'intrepid studio director'
      },
      {
        'value': '0.455191',
        'key': 'interactive visualization'
      },
      {
        'value': '0.454498',
        'key': 'Scientific Visualization'
      },
      {
        'value': '0.454447',
        'key': 'KTH Innovation'
      },
      {
        'value': '0.453756',
        'key': 'branching visualization'
      },
      {
        'value': '0.453037',
        'key': 'scariest visualization'
      },
      {
        'value': '0.452718',
        'key': 'visualization researchers'
      },
      {
        'value': '0.451455',
        'key': 'virtual reality experience'
      },
      {
        'value': '0.451069',
        'key': 'visualization tools'
      }
    ];*/
    //Steam graph
    this.d3Data3 = [];
    $http.get('/api/things/general').success(function(data){
      $scope.pageData = [];
      data.forEach(function(d,i){
        var date = new Date(d.Date);
        if(date.valueOf()){
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
