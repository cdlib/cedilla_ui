/**
 * Services module. All cdla_ui services go here.
 * Services are injected into controllers or into other services 
 */

var cdlaServices = angular.module('cdlaServices', []);

cdlaServices.factory('cdlaSocketService', function() {
    // TODO inject config service?
    var connectString = 'http://cdla-api-stg.cdlib.org:3005/';

    // TODO set timeout using io.Manager and listen for client-side events
    var socket = io.connect(connectString);

    // TODO this is very rudimentary check for failure
    if (socket) {
        console.log("Opened connection to " + connectString);
    } else {
        throw ("socket connect failed");
    }
    return socket;
});

/**
 * Socket listener listens on a socket and updates the model.
 *
 */
cdlaServices.factory('cdlaSocketListener', function() {
    listener = {};
    listener.listen = function(socket, model, query, digester) {
        socket.emit('openurl', query);
        console.log("emitted openurl client event with params " + query);

        socket.on('complete', function(data) {
            console.log("data stream is complete");
            complete = true;
        });

        socket.on('citation', function(data) {
            console.log("Handling citation event, data: " + data);
            var citation_update = JSON.parse(data);
            console.log(citation_update);
            model.citation = citation_update;
 //           digester();
        });

        socket.on('resource', function(data) {
            console.log("Handling resource event, data: " + data);
            var new_resource = JSON.parse(data);
            console.log(new_resource);
            model.resources.push(new_resource);
//            digester();
        });

        socket.on('error', function(data) {
            console.log("Handling error event, data: " + data);
            error = true;
            model.error = data;
            // digester not called because it is undefined at this point for as yet unknown reasons
        });
    };

    return listener;
});

