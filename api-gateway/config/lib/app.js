'use strict';
/**
 * Module dependencies.
 */

const chalk = require('chalk');
const config = require('../config');
const express = require('./express');

const events = require("events");
events.EventEmitter.prototype._maxListeners = 100;

var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');
mongoose.connect(config.db.mongodb.uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // console.log("h");
});

  app.get('/heartbeat', function(req, res){
    var status = {
        success: true,
        address: config.host,
        port: server.address().port
    };
    res.send(status);
});

var server = app.listen(config.port,  function () {
	var host = config.host;
	var port = server.address().port;
	
	console.log('Server Running On: http://%s:%s', host, port);
});

// app.listen(config.port, function() {
//   console.log('Search service is working');
// })


module.exports = app


