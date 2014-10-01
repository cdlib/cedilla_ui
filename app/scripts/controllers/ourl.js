'use strict';

/**
 * @ngdoc function
 * @name cdlaUiApp.controller:OurlCtrl
 * @description
 * # OurlCtrl
 * Controller of the cdlaUiApp
 * Handled incoming OpenURL links and 
 * gets resources and citation updates from the Cedilla aggregator.
 */
angular.module('cdlaUiApp')
  .controller('OurlCtrl', function ($scope) {
    $scope.item = { 'citation' : undefined, resources : [] };
  });
