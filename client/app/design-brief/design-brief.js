'use strict';

angular.module('dh2321InformationVisualizationApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('design-brief', {
        url: '/design-brief',
        templateUrl: 'app/design-brief/design-brief.html',
        controller: 'DesignBriefCtrl'
      });
  });
