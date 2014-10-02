/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */

var cdlaControllers = angular.module('cdlaControllers', []);

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', function ($scope) {
    $scope.active_button = 'home';
});

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', function ($scope) {
    $scope.$parent.active_button = 'home';
});

/**
 * Controller of the manual test page 
 */
cdlaControllers.controller('TestCtrl', function ($scope) {
  $scope.$parent.active_button = 'test'; 
});

/**
 * Open URL controller. Handled OpenURL get.
 * Connects to the cedilla aggregator and gets
 * Streaming resources via socket.io
 */
cdlaControllers.controller('OurlCtrl', function ($scope) {
    $scope.item = { 'citation' : undefined, resources : [] };
    $scope.$parent.active_button = '';
});
