'use strict';

/**
 * Services module. All cdla_ui services go here.
 * Services are injected into controllers or into other services 
 */

var cdlaDirectives = angular.module('cdlaDirectives', ['cdlaConfig']);

cdlaDirectives.directive('helloCampus', function() {
  return {
    restrict: 'AE',
    replace: 'true',
    template: '<h3>Hello {{campus}}</h3>'
  };
});

cdlaDirectives.directive('cdlaLoad', ['$parse', function($parse) {
    return {
      restrict: 'A',
      compile: function($element, attr) {
        alert(attr['cdlaLoad']);
        var fn = $parse(attr['cdlaLoad']);
        return function(scope, element, attr) {
          element.on('load', function(event) {
            scope.$apply(function() {
              fn(scope, {$event: event});
            });
          });
        };
      }
    };
  }]);



