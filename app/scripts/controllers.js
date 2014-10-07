'use strict';

/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */


var cdlaControllers = angular.module('cdlaControllers', []);

var initViewState = function () {
  return { showDebug : true, showFullText : true, showOptions : true};
};

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', ['$scope', function ($scope) {
    console.log('Main controller');
    $scope.navState = { 'currentPage' : 'home' };
    console.log('Current page is ' + $scope.navState.currentPage);
}]);

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', ['$scope', function ($scope) {
    console.log('Home controller');
    $scope.$parent.navState.currentPage = 'home'; 
}]);

/**
 * Controller of the manual test page 
 */
cdlaControllers.controller('TestCtrl', ['$scope', function ($scope) {
  $scope.$parent.navState.currentPage = 'test';
}]);

/**
 * Open URL controller. Handled OpenURL get.
 * Connects to the cedilla aggregator and gets
 * Streaming resources via socket.io
 */
cdlaControllers.controller('OurlCtrl', ['$scope', '$window', 'cdlaSocket', 'cdlaSocketListener', function ($scope, $window, socket, listener) {
    $scope.item = { 'citation' : undefined, resources : [], 'error' : '' };
    $scope.$parent.navState.currentPage = 'ourl';
    $scope.viewState = initViewState();
    var url = $window.location.toString();
    $scope.query = url.substr(url.indexOf('?') + 1, url.length);
    listener.listen(socket, $scope);    
}]);
