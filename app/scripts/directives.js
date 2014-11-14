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




