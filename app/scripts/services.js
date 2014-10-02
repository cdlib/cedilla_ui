/**
 * Services module. All cdla_ui services go here.
 */

var cdlaServices = angular.module('cdlaServices', []);

cdlaServices.factory('cdlaSocketService', function(){
  var socketService = {};
  socketService.test = function() {
    return "ok";
  }
  return socketService;
});

