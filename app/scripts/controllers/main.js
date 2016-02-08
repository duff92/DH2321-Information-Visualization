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
      chart: {
        type: 'parallelCoordinates',
        height: 450,
        margin: {
          top: 30,
          right: 30,
          bottom: 10,
          left: 30
        },
        lines: {
          dispatch: {
            elementClick: function(e){ console.log('click',e); },
            elementMouseover: function(e){ console.log('mouseover',e); },
            elementMouseout: function(e){ console.log('mouseout',e); },
            renderEnd: function(e){ console.log('renderEnd',e); }
          }
        },
        dimensions: [
          'economy (mpg)',
          'cylinders',
          'displacement (cc)',
          'power (hp)',
          'weight (lb)',
          '0-60 mph (s)',
          'year',
          'test1',
          'test2',
          'test3',
          'test4',
          'test5',
          'test6',
          'test7'
        ]
      }
    };

    $scope.data = function () {
      return [
        {
          'name': 'AMC Ambassador Brougham',
          'economy (mpg)': '13',
          'cylinders': '8',
          'displacement (cc)': '360',
          'power (hp)': '175',
          'weight (lb)': '3821',
          '0-60 mph (s)': '11',
          'year': '73',
          'test1': '1',
          'test2': '1',
          'test3': '1',
          'test4': '1',
          'test5': '1',
          'test6': '1',
          'test7': '1'
        }
      ];};
  });
