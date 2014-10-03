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
cdlaControllers.controller('OurlCtrl', ['$scope', '$window', function ($scope, $window) {
    $scope.item = { 'citation' : undefined, resources : [] };
    $scope.$parent.active_button = '';
    var url = $window.location.toString();
    var query = url.substr(url.indexOf('?') + 1, url.length);
    console.log(query);
    var connectString = 'http://cdla-api-stg.cdlib.org:3005/';
    var socket = io.connect(connectString, {'force new connection': true});
    if (socket) {
      console.log("Opened connection to " + connectString);
    } else {
      throw ("socket connect failed");
    }
    
    socket.emit('openurl', query);
    console.log("emitted openurl client event with params " + query);

    socket.on('complete', function(data) {
      console.log("socket closed; data stream is complete");
      complete = true;
      socket.disconnect();
    });

    socket.on('citation', function(data) {
      console.log("Handling citation event, data: " + data);
      var citation_update = JSON.parse(data);
      console.log(citation_update);
//      page_display.display_citation(citation_update['citation']);
    });

    socket.on('resource', function(data) {
      console.log("Handling resource event, data: " + data);
      var new_resource = JSON.parse(data);
      console.log(new_resource);
      //resources.push(new_resource);
      //page_display.display_resource(new_resource.resource);
    });

    socket.on('error', function(data) {
      console.log("Handling error event, data: " + data);
      error = true;
      //page_display.display_error(data);
    });

}]);
