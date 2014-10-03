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
    listener = {};
    listener.listen = function(socket, scope) {
        socket.emit('openurl', scope.query);
        console.log("emitted openurl client event with params " + scope.query);

        socket.on('complete', function(data) {
            console.log("data stream is complete");
            complete = true;
        });

        socket.on('citation', function(data) {
            console.log("Handling citation event, data: " + data);
            var citation_update = JSON.parse(data);
            console.log(citation_update);
            scope.item.citation = citation_update;
        });

        socket.on('resource', function(data) {
            console.log("Handling resource event, data: " + data);
            var new_resource = JSON.parse(data);
            console.log(new_resource);
            scope.item.resources.push(new_resource);
        });

        socket.on('error', function(data) {
            console.log("Handling error event, data: " + data);
            error = true;
            scope.error = data;
        });
    };

    return listener;
});

cdlaServices.factory('cdlaSocket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://cdla-api-stg.cdlib.org:3005/'),
    prefix : 'cdla'
  });
});
