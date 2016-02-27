'use strict';

angular.module('dh2321InformationVisualizationApp', [
  'dh2321InformationVisualizationApp.auth',
  'dh2321InformationVisualizationApp.admin',
  'dh2321InformationVisualizationApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'd3'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
