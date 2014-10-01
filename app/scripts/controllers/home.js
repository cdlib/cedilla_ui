'use strict';

/**
 * @ngdoc function
 * @name cdlaUiApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the cdlaUiApp
 */
angular.module('cdlaUiApp')
  .controller('HomeCtrl', function ($scope) {
    $scope.$parent.active_button = 'home';
  });

