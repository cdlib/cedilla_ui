'use strict';

/**
 * Main module of the application.
 */

var cdlaApp = angular
  .module('cdlaUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'lodash',
    'cdlaControllers',
    'cdlaServices',
    'cdlaFilters'
  ]);
  
  cdlaApp.config(function ($routeProvider) {
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
