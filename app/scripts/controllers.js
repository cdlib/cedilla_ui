'use strict';

/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */

var cdlaControllers = angular.module('cdlaControllers', ['cdlaConfig']);

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.navState = {'currentPage': 'home'};
    $scope.changeView = function(viewName) {
      // console.log("changing view to " + viewName);
      $rootScope.$broadcast('changeView', viewName);
    };
  }]);

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', ['$scope', function($scope) {
    //console.log('Home controller');
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
cdlaControllers.controller('OurlCtrl', ['$scope', '$window', 'cdlaSocketListener', 'cdlaCitation', 'cdlaCitationFormatter', '$sce', 'cdlaQuoter',
  function($scope, $window, listener, citationService, citationFormatter, $sce, cdlaQuoter) {

    $scope.$parent.navState.currentPage = 'ourl';

    var loadCounter = 0;

    // the load event is fired twice by the iframe
    // in which the fulltext is display
    // incrementing the value seems crude, but it works
    // in Safari, Chrome, and Firefox
    $window.displayFulltext = function() {
      if (loadCounter > 0) {
        $scope.changeView("fullText");
        loadCounter = 0;
      } else {
        loadCounter = loadCounter + 1;
      }
    };

    /**
     * 
     * Factory function for the viewState object
     */
    var initViewState = function() {
      var vwState = {};
      var currentState = {showDebug: false, showFullText: false, showOptions: false, showWait: true, fullTextIndex: 0, displayTargets: []};
      vwState.showDebug = currentState.showDebug;
      vwState.showOptions = currentState.showOptions;
      vwState.showWait = currentState.showWait;
      vwState.fullTextIndex = currentState.fullTextIndex;
      vwState.displayTargets = currentState.displayTargets;
      vwState.quote = cdlaQuoter.getRandomQuote();

      vwState.changeView = function(viewName) {
        switch (viewName) {
          case 'fullText':
            this.showFullText = true;
            this.showOptions = false;
            this.showWait = false;
            break;
          case 'options':
            this.showOptions = true;
            this.showFullText = false;
            this.showWait = false;
            break;
          case 'wait':
            this.showWait = true;
            this.showOptions = false;
            this.showFullText = false;
            break;
          case 'debug':
            this.showDebug = true;
            break;
        }
      };

      vwState.switchFullTextDisplay = function(index) {
        if (index > this.displayTargets.length - 1) {
          this.displayTargets[index] = $scope.item.eResources[index];
        }
        this.fullTextIndex = index;
        this.changeView('fullText');
      };

      return vwState;
    };

    /*
     * 
     * Factory function for the progressBar object.
     */
    var initProgressBar = function() {
      return {percent: 15, text: 'Looking...', clearVar: undefined,
        'lastInch': function() {
          var self = this;
          //console.log("progressbar: " + JSON.stringify(self));
          var INTERVAL = 1000;
          this.percent = 90;
          window.clearVar = setInterval(function() {
            if (self.percent < 100) {
              self.percent += 1;
              $scope.$digest();
            } else {
              clearInterval(window.clearVar);
            }
            //console.log("incremented to " + self.percent);
          }, INTERVAL);
        }
      };
    };

    /**
     * 
     * Factory function for the item object.
     */
    var initItem = function() {
      return {query: '', originalCitation: {}, citation: {}, citationEvents: [], displayCitation: {}, resources: [], eResources: [], error: '', fullTextFound: false, };
    };

    /**
     * Responder changes the model based on events in the cdlaSocketListener.
     */
    var initEventResponder = function() {
      var responder = {};

      responder.handleComplete = function() {
        if (!$scope.item.fullTextFound) {
          //console.log("complete event, changing to options");
          $scope.changeView("options");
        } else {
          //console.log("complete event, changing to fulltext");
          $scope.changeView("fullText");
        }
      };

      responder.handleCitation = function(data) {
        var citationEvent = JSON.parse(data);
        citationService.mergeCitation($scope.item.citation, citationEvent.citation, false);
        $scope.item.displayCitation = citationFormatter.toDisplayCitation($scope.item.citation);
        $scope.item.citationEvents.push(citationEvent);
        if ($scope.progressBar.percent <= 90 && !$scope.item.fullTextFound) {
          $scope.progressBar.percent += 5;
          $scope.progressBar.text = "Enhancing citation";
        }
      };

      responder.handleResource = function(data) {
        var newResource = JSON.parse(data);
        $scope.item.resources.push(newResource.resource);
        if (newResource.resource.format === 'electronic') {
          newResource.resource.target = $sce.trustAsResourceUrl(newResource.resource.target);
          $scope.item.eResources.push(newResource.resource);
          if (!$scope.item.fullTextFound) {
            $scope.progressBar.text = "Loading electronic resource";
            $scope.progressBar.lastInch();
            $scope.viewState.displayTargets.push(newResource.resource);
            $scope.item.fullTextFound = true;
          }
        } else {
          if ($scope.progressBar.percent <= 90 && !$scope.item.fullTextFound) {
            $scope.progressBar.percent = $scope.progressBar.percent + 10;
            $scope.progressBar.text = "Found copy in library";
          }

        }
      };

      responder.handleError = function(data) {
        console.log('Handling error event, data: ' + data);
      };

      return responder;
    };


    $scope.$parent.navState.currentPage = 'ourl';
    $scope.viewState = initViewState();
    // TODO -- give the parent scope only the data it needs
    // not the whole viewState for this page
    $scope.$parent.navState.viewState = $scope.viewState;
    $scope.item = initItem();
    $scope.progressBar = initProgressBar();
    var url = $window.location.toString();
    $scope.item.query = url.substr(url.indexOf('?') + 1, url.length);
    citationService.initCitation($scope.item);

    listener.listen(initEventResponder(), $scope.item.query);

    /**
     * Handle changeView event broadcast from the root scope
     */
    $scope.$on('changeView', function(event, viewName) {
      $scope.viewState.changeView(viewName);
    });
  }]);
