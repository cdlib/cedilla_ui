'use strict';

/**
 * Services module. All cdla_ui services go here.
 * Services are injected into controllers or into other services 
 */

var cdlaServices = angular.module('cdlaServices', []);

/**
 * Socket listener listens on a socket and updates the model.
 *
 */
cdlaServices.factory('cdlaSocketListener', ['$sce', function($sce) {
        var listener = {};
        listener.listen = function(socket, scope) {
            socket.emit('openurl', scope.item.query);
            console.log('emitted openurl client event with params ' + scope.item.query);

            socket.on('complete', function() {
                console.log('data stream is complete');
            });

            socket.on('citation', function(data) {
                console.log('Handling citation event, data: ' + data);
                var citationUpdate = JSON.parse(data);
                console.log('Updated citation with ' + citationUpdate);
                scope.item.citationEvents.push(citationUpdate);
            });

            socket.on('resource', function(data) {
                console.log('Handling resource event, data: ' + data);
                var newResource = JSON.parse(data);
                console.log('Adding new resource: ' + newResource);
                scope.item.resources.push(newResource.resource);
                if (!scope.item.fullTextTarget && newResource.resource.format === 'electronic') {
                    console.log('Setting fullTextTarget = ' + newResource.resource.target);
                    scope.item.fullTextTarget = $sce.trustAsResourceUrl(newResource.resource.target);
                    scope.viewState.showOptions = false;
                    scope.viewState.showFullText = true;
                }
            });

            socket.on('error', function(data) {
                console.log('Handling error event, data: ' + data);
                scope.error = data;
            });
        };

        return listener;
    }]);

cdlaServices.factory('cdlaSocket', function(socketFactory) {
    return socketFactory({
        /* global io */
        ioSocket: io.connect('http://cdla-api-stg.cdlib.org:3005/')
    });
});


cdlaServices.factory('cdlaCitation', ['$http', function($http) {

        var cdlaCitation = {};
        var _http = $http;

        /*
         * Returns a deferred query result
         */
        cdlaCitation.initCitation = function(item) {
            console.log('initCitation using ' + JSON.stringify(item.query) + ' and ' + item.citation);
            _http.get('http://localhost:3005/citation?' + item.query)
                    .success(function (data, status, headers, config){
                        console.log('result is ' + JSON.stringify(data));
                        item.citation = data;
                    })
                    .error(function(data, status, headers, config){
                        console.log('error is ' + JSON.stringify(data));
                    });
            return this;
        };
            
      

        cdlaCitation.description = 'citation service';

        return cdlaCitation;
    }]);
