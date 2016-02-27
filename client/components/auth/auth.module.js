'use strict';

angular.module('dh2321InformationVisualizationApp.auth', [
  'dh2321InformationVisualizationApp.constants',
  'dh2321InformationVisualizationApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
