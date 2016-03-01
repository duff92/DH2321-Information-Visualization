'use strict';

angular.module('dh2321InformationVisualizationApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('analyze', {
        url: '/analyze',
        templateUrl: 'app/analyze/analyze.html',
        controller: 'AnalyzeCtrl'
      });
  });
