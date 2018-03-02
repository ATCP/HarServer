"use strict";

var fs = require('fs');
const URL = require('url').Url;
var path = require('path');
var webServer = require('./webServer.js');

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// websocket and http servers
var webSocket = require('ws');
var http = require("http");


const server = http.createServer(webServer.app);

const wss = new webSocket.Server({server: server});


// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}



function modify(url) {
    var _url = url.replace(/\/\//g, '-').replace(/\//g, '-');
    console.log(_url);
    return _url;
}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
                (mm>9 ? '' : '0') + mm,
		(dd>9 ? '' : '0') + dd
	   ].join('-');
};

var extensions = { };

// This callback function is called every time someone
// tries to connect to the WebSocket server
wss.on('connection', function(ws, res) {
    //console.dir(ws);

    console.log((new Date()) + ' Connection from origin ' + res.headers.origin.split('//') + '.');
    console.log((new Date()) + ' Connection from remoteAddress ' + ws._socket.remoteAddress + ':' + ws._socket.remotePort);

    var index = clients.push(ws) - 1;
    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    ws.on('message', function (message) {
        //console.dir(message);
    console.log('receive har id %s from host %s', JSON.parse(message).log.creator.name, ws._socket.remoteAddress + ':' + ws._socket.remotePort);

        var chromeExtension = res.headers.origin.split('//');
        var extensionId = chromeExtension[chromeExtension.length - 1];

        var remoteClient = ws._socket.remoteAddress.split(':');
        var remoteIP = remoteClient[remoteClient.length - 1];
        var remotePort = ws._socket.remotePort;

        var har = JSON.parse(message);
        var tabId = har.log.creator.name;

        /*
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
        */

        var now = new Date();
        //var logDir = now.getFullYear() + "-"+ (now.getMonth() + 1) + "-" + now.getDate();
	var logDir = now.yyyymmdd();

        if (!fs.existsSync(logDir)) {
            fs.mkdir(logDir, function (err) {
                if (err) throw (err);
            })
        }



        if (!fs.existsSync(path.join(logDir, remoteIP + '.' + remotePort))) {
            fs.mkdir(path.join(logDir, remoteIP + '.' + remotePort), function (err) {
                if (err) throw (err);
            });
        }

        var logDir = path.join(logDir, remoteIP + '.' + remotePort);

        //var tabUrl = modify(JSON.parse(message.utf8Data).tabUrl);
        var tabHarPath = path.join(logDir, 'tab-' + tabId + '.har');
        fs.appendFile(tabHarPath, JSON.stringify(har, null, 2), 'utf8', function (err) {
            if (err) throw err;
        });

    });
});


server.listen(process.env.PORT || 1337, function () {
    console.log('Server started on port %d', server.address().port);
});



