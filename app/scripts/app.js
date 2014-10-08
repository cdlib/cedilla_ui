'use strict';

/**
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
    'btford.socket-io',
    'cdlaControllers',
    'cdlaServices'
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
