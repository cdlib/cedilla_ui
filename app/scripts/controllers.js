'use strict';

/**
 * Controllers module. All cdla_ui controllers go here.
 *
 */

var cdlaControllers = angular.module('cdlaControllers', ['cdlaConfig']);

/**
 * Main controller of the application.
 */
cdlaControllers.controller('MainCtrl', ['$scope', '$sce', 'cdlaProperties', function($scope, $sce, cdlaProperties) {
    $scope.navState = {'currentPage': 'home'};
    $scope.bodyClass = '';
    $scope.showHeader = true;
    $scope.socketIOAddress = $sce.trustAsResourceUrl(cdlaProperties.SOCKETIO_ADDRESS);
    $scope.sprint_name = cdlaProperties.SPRINT_NAME;
    $scope.$on('changeView', function(event, data) {
      // console.log(event);
      if (data === 'fullText' || data === 'fullTextMax') {
        $scope.bodyClass = 'noscroll';
      } else {
        $scope.bodyClass = '';
      }
      if (data === 'fullTextMax') {
        $scope.showHeader = false;
      } else {
        $scope.showHeader = true;
      }
    });

  }]);

/**
 * Controller of the home page.
 */
cdlaControllers.controller('HomeCtrl', ['$scope', function($scope) {
    //console.log('Home controller');
    $scope.$parent.navState.currentPage = 'home';
  }]);

/**
 * Controller for the About page
 */
cdlaControllers.controller('AboutCtrl', ['$scope', 'cdlaProperties', function($scope, properties) {
    console.log('About controller');
    $scope.$parent.navState.currentPage = 'about';
    $scope.version = properties.VERSION;
    $scope.image = properties.SPRINT_IMAGE;
    $scope.sprint_name = properties.SPRINT_NAME;
    $scope.release_date = properties.RELEASE_DATE;
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
        $scope.viewState.changeView("fullText");
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

      vwState.showDebug = false;
      vwState.showFullText = false;
      vwState.showFullTextMax = false;
      vwState.showOptions = false;
      vwState.showWait = true;
      vwState.fullTextIndex = 0;
      vwState.displayCitationPanel = true;
      vwState.displayTargets = [];
      vwState.quote = cdlaQuoter.getRandomQuote();

      vwState.changeView = function(viewName) {
        switch (viewName) {
          case 'fullText':
            this.showFullText = true;
            this.showFullTextMax = false;
            this.showOptions = false;
            this.showWait = false;
            this.displayCitationPanel = true;
            break;
          case 'fullTextMax':
            this.showFullText = false;
            this.showFullTextMax = true;
            this.showOptions = false;
            this.showWait = false;
            this.displayCitationPanel = false;
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
        // emit an event so that the main controller can react
        $scope.$emit('changeView', viewName);
      };
      
      vwState.toggleCitationPanelDisplay = function() {
        if (vwState.displayCitationPanel) {
          
        } else {
          
        }
        vwState.displayCitationPanel = !vwState.displayCitationPanel;
      };

      /**
       * When there are multiple options for displaying fulltext,
       * changes which fulltext window is displayed.
       * 
       * If the fulltext is not in the displayTargets array yet, then 
       * insert it in the array at the position occupied by the placeholder.
       */
      vwState.switchFullTextDisplay = function(index) {
        if (!(this.displayTargets[index].target)) {
          this.displayTargets[index] = $scope.item.eResources[index];
        }
        this.fullTextIndex = index;
        this.changeView('fullText');

        console.log("Switching fulltext eResources = " + JSON.stringify($scope.item.eResources));
        console.log("displayTargets = " + JSON.stringify(this.displayTargets));
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
      return {query: '', originalCitation: {}, citation: {}, citationEvents: [], displayCitation: {}, resources: [], eResources: [], error: '', fullTextFound: false, holdingsFound: false};
    };

    /**
     * Responder changes the model based on events in the cdlaSocketListener.
     */
    var initEventResponder = function() {
      var responder = {};

      responder.handleComplete = function() {
        $scope.complete = true;
        if (!$scope.item.fullTextFound) {
          $scope.viewState.changeView("options");
        } else {
          $scope.viewState.changeView("fullText");
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
        if (newResource.resource.format === 'electronic' && newResource.resource.source) {
          newResource.resource.target = $sce.trustAsResourceUrl(newResource.resource.target);
          $scope.item.eResources.push(newResource.resource);
          if (!$scope.item.fullTextFound) {
            $scope.progressBar.text = "Loading electronic resource";
            $scope.progressBar.lastInch();
            $scope.viewState.displayTargets.push(newResource.resource);
            $scope.item.fullTextFound = true;
          } else {
            // add a placeholder to keep the two lists in synch
            $scope.viewState.displayTargets.push({target: ''});
          }
        } else {
          $scope.item.holdingsFound = true;
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
    $scope.item = initItem();
    $scope.progressBar = initProgressBar();
    var url = $window.location.toString();
    $scope.item.query = url.substr(url.indexOf('?') + 1, url.length);
    // TODO -- remove initial & in query?
    citationService.initCitation($scope.item);

    listener.listen(initEventResponder(), $scope.item.query);

  }]);
