'use strict'

var express = require("express");

var app = express();

var webServerPort = 8080;

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    //res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(express.static(__dirname + '/public'));

/* serves main page */
app.get("/", function(req, res) {
    res.sendFile('index.html')
});

app.post("/user/add", function(req, res) {
    /* some server side logic */
    res.send("OK");
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
    console.log('static file request : ' + req.params);
    res.sendFile( __dirname + req.params[0]);
});

/*
var port = process.env.PORT || webServerPort;
app.listen(port, function() {
    console.log("Listening on " + port);
});
*/

exports.app = app;

