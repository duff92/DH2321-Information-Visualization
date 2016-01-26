'use strict';

/**
 * @ngdoc function
 * @name dh2321InformationVisualizationApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dh2321InformationVisualizationApp
 */
angular.module('dh2321InformationVisualizationApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
      $scope.labels =['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

      $scope.data = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
      ];
  }]);
