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
    'cdlaConfig',
    'cdlaQuotes',
    'cdlaDirectives',
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
  
   /**
 * 
 * Third-part dependencies as modules
 */

var lodash = angular.module('lodash', []);

lodash.factory('_', function() {
  return window._;
});


