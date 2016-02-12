'use strict';
/**
* SNIFF - Sniff around for sensors that allow us to grab their data
* Module is responsible for finding sensor APs connecting and extracting
* the data as well as converting to JSON
*/
var target_host = '192.168.4.1';

var Promise = require('promise');
var request = require('request');
var net = require('net');


function sniff (host) {
  target_host = host || target_host;

  var http_options = {
    host: target_host,
    port: 80,
    agent: false
  };

  var promise = new Promise(function (resolve, reject) {
    var client = new net.Socket();

    client.connect(http_options.port, http_options.host, function() {
      console.log('Connected: ' + http_options.host + ':' + http_options.port);
    });

    // when we get data
    client.on('data', function (data) {

      console.log('Received: ' + data);
      // todo try catch for errors and send error data
      var json_data = JSON.parse(data.toString());
      // kill client after server's response
      client.destroy();
      // send data back via the promise
      resolve(json_data);
    });// end client on data

    client.on('close', function() {
      console.log('Connection closed');
    });

  }); // end Promise

  return promise;
}

exports.sniff = sniff;
// sniff('192.168.4.1');
