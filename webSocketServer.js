// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

var fs = require('fs');
const URL = require('url').Url;
var path = require('path');

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');


// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});


/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});


function modify(url) {
    var _url = url.replace(/\/\//g, '-').replace(/\//g, '-');
    console.log(_url);
    return _url;
}

var extensions = { };

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin.split('//') + '.');	
    console.log((new Date()) + ' Connection from remoteAddress ' + request.remoteAddress + '.');
    console.log((new Date()) + ' Connection from resource ' + request.resource + '.');

    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    connection.on('message', function(message) {
        if (message.type == 'utf8') { // accept only text
            //var tabUrl = new URL(JSON.parse(message.utf8Data).tabUrl);
            //console.log(tabUrl.host);
            var chromeExtension = request.origin.split('//');
            var extensionId = chromeExtension[chromeExtension.length - 1];
            var requestInfo = JSON.parse(message.utf8Data);
            var tabId = requestInfo.tabId;
            var tabUrl = requestInfo.tabUrl;

            // init extension struct
            if (!extensions[extensionId]) {
                extensions[extensionId] = {
                    id: extensionId,
                    tabs: {}
                }
            }

            // init tab struct
            if (!extensions[extensionId].tabs[tabId]) {
                extensions[extensionId].tabs[tabId] = {
                    id: tabId,
                    urls: []
                }
            }

            // push url under the tab
            extensions[extensionId].tabs[tabId].urls.push(tabUrl);
            if (!fs.existsSync(extensions[extensionId].id)) {
                fs.mkdir(extensions[extensionId].id, function (err) {
                    if (err) throw (err);
                });
            }


            //var tabUrl = modify(JSON.parse(message.utf8Data).tabUrl);
            var tabHarPath = path.join(extensions[extensionId].id, 'tab-' + extensions[extensionId].tabs[tabId].id + '.har');
            fs.appendFile(tabHarPath, message.utf8Data + '\n', 'utf8', function (err) {
                if (err) throw err;
            });

            //fs.appendFile(tabHarPath, '\n', 'utf8', null);
        }
    });

    // user disconnected
    connection.on('close', function(connection) {

    });

});
