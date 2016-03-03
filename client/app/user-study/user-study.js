'use strict';

angular.module('dh2321InformationVisualizationApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-study', {
        url: '/user-study',
        templateUrl: 'app/user-study/user-study.html',
        controller: 'UserStudyCtrl'
      });
  });
