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
cdlaServices.factory('cdlaSocketListener', function() {
    var listener = {};
    listener.listen = function(socket, scope) {
        socket.emit('openurl', scope.query);
        console.log('emitted openurl client event with params ' + scope.query);

        socket.on('complete', function() {
            console.log('data stream is complete');
        });

        socket.on('citation', function(data) {
            console.log('Handling citation event, data: ' + data);
            var citationUpdate = JSON.parse(data);
            console.log('Updated citation with ' + citationUpdate);
            scope.item.citation = citationUpdate;
        });

        socket.on('resource', function(data) {
            console.log('Handling resource event, data: ' + data);
            var newResource = JSON.parse(data);
            console.log('Adding new resource: ' + newResource);
            scope.item.resources.push(newResource);
        });

        socket.on('error', function(data) {
            console.log('Handling error event, data: ' + data);
            scope.error = data;
        });
    };

    return listener;
});

cdlaServices.factory('cdlaSocket', function (socketFactory) {
  return socketFactory({
    /* global io */
    ioSocket: io.connect('http://cdla-api-stg.cdlib.org:3005/'),
  });
});
