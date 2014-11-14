'use strict';

/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */


var cdlaControllers = angular.module('cdlaControllers', ['cdlaConfig']);

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', ['$scope', function($scope) {
    $scope.navState = {'currentPage': 'home'};
    $scope.changeView = function(viewName) {
      this.$broadcast('changeView', viewName);
    };
  }]);

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', ['$scope', function($scope) {
    console.log('Home controller');
    $scope.$parent.navState.currentPage = 'home';
  }]);

/**
 * Controller of the manual test page 
 */
cdlaControllers.controller('TestCtrl', ['$scope', function($scope) {
    $scope.$parent.navState.currentPage = 'test';
    $scope.campus = 'ucb';
  }]);

/**
 * Open URL controller. Handled OpenURL get.
 * Connects to the cedilla aggregator and gets
 * Streaming resources via socket.io
 */
cdlaControllers.controller('OurlCtrl', ['$scope', '$window', 'cdlaSocket', 'cdlaSocketListener', 'cdlaCitation',
  function($scope, $window, socket, listener, citationService) {

    var loadCounter = 0;

    // the load event is fired twice by the iframe
    // in which the fulltext is display
    // incrementing the value seems crude, but it works
    // in Safari, Chrome, and Firefox
    window.displayFulltext = function() {
      $scope.viewState.fullTextFound = true;
      if (loadCounter > 0) {
        changeView("fullText");
        loadCounter = 0;
      } else {
        loadCounter = loadCounter + 1;
      }
    };

    var initViewState = function() {
      return {showDebug: false, showFullText: false, showOptions: false, showWait: true, fullTextFound : false};
    };
    
    var initProgressBar = function () {
      return { percent: 10, text: 'Finding your item...' }
    };

    var initItem = function() {
      return {query: '', originalCitation: {}, citation: {}, citationEvents: [], displayCitation: {}, resources: [], error: ''};
    };


    $scope.$parent.navState.currentPage = 'ourl';
    $scope.viewState = initViewState();
    $scope.$parent.navState.viewState = $scope.viewState;
    $scope.item = initItem();
    $scope.progressBar = initProgressBar();
    var url = $window.location.toString();
    $scope.item.query = url.substr(url.indexOf('?') + 1, url.length);
    citationService.initCitation($scope.item);

    listener.listen(socket, $scope);


    var changeView = function(toView) {
      $scope.viewState.showFullText = false;
      $scope.viewState.showOptions = false;
      $scope.viewState.showWait = false;
      switch (toView) {
        case 'fullText':
          $scope.viewState.showFullText = true;
          break;
        case 'options':
          $scope.viewState.showOptions = true;
          break;
        case 'wait':
          $scope.viewState.showWait = true;
        case 'debug':
          $scope.viewState.showDebug = true;
          break;
      }
    };

    // handle changeView event broadcast from the parent scope
    $scope.$on('changeView', function(event, data) {
      changeView(data);
    });
  }]);
