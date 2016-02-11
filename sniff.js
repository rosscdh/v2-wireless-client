'use strict';

var target_host = '192.168.4.1';
var hiveempire_host = 'http://localhost:8009/v1/event/';

var Promise = require('promise');
var request = require('request');
var net = require('net');


function sniff(host, options) {
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

    client.on('data', function(data) {
      console.log('Received: ' + data);
      var json_data = JSON.parse(data.toString());

      var send_data = {"source": null,
                     "sensor_action": "temperature,humidity",
                     "temperature": json_data.temp,
                     "humidity": json_data.humidity,
                     "tags": {
                         "device_id": options.sense.id,
                         "sensor_id": options.device.mac,
                         "channel": options.device.channel,
                         "signal_level": options.device.signal_level,
                         "security": options.device.security,
                     }};
      request.post({
        url: options.hiveempire_host || hiveempire_host,
        json: send_data
      },
      function optionalCallback(err, httpResponse, body) {
        client.destroy(); // kill client after server's response
        if (err) reject(err);
        resolve(body);
      });

    });// end client on data

    client.on('close', function() {
      console.log('Connection closed');
    });

  }); // end Promise

  return promise;
}

module.exports = sniff
// var data = {hiveempire_host: 'http://localhost:8008/v1/event/',
//             sense: {id: '00000000d390eefe' },
//             device: {mac: 'a2:05:43:a1:7f:1c',
//                      ssid: 'KROJ',
//                      channel: '36,+1',
//                      signal_level: '-71',
//                      security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'}}
// sniff('192.168.4.1', data);
