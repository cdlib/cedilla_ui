/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */


var cdlaControllers = angular.module('cdlaControllers', []);

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.active_button = 'home';
}]);

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.$parent.active_button = 'home';
}]);

/**
 * Controller of the manual test page 
 */
cdlaControllers.controller('TestCtrl', ['$scope', function ($scope) {
  $scope.$parent.active_button = 'test'; 
}]);

/**
 * Open URL controller. Handled OpenURL get.
 * Connects to the cedilla aggregator and gets
 * Streaming resources via socket.io
 */
cdlaControllers.controller('OurlCtrl', ['$scope', '$window', 'cdlaSocket', 'cdlaSocketListener', function ($scope, $window, socket, listener) {
    $scope.item = { 'citation' : undefined, resources : [], 'error' : '' };
    $scope.$parent.active_button = '';
    var url = $window.location.toString();
    $scope.query = url.substr(url.indexOf('?') + 1, url.length);
    listener.listen(socket, $scope);    
}]);
