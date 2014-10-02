'use strict';

/**
 * @ngdoc overview
 * @name cdlaUiApp
 * @description
 * # cdlaUiApp
 *
 * Main module of the application.
 */
angular
  .module('cdlaUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'cdlaControllers'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl'
      })
      .when('/ourl', {
        templateUrl: 'views/ourl.html',
        controller: 'OurlCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
