'use strict';

var target_host = '192.168.4.1';
var hiveempire_host = 'http://localhost:8009/v1/event/';

var request = require('request');
var net = require('net');


function sniff(host, options) {
  target_host = host || target_host;

  var http_options = {
    host: target_host,
    port: 80,
    agent: false
  };

  var client = new net.Socket();
  client.connect(http_options.port, http_options.host, function() {
    console.log('Connected: ' + http_options.host + ':' + http_options.port);
  });

  client.on('data', function(data) {
    console.log('Received: ' + data);
    var json_data = JSON.parse(data.toString());

    var send_data = {"sensor_action":
                     "temperature,humidity",
                     "temperature": json_data.temp,
                     "humidity": json_data.humidity,
                     "tags": {
                         "device_id": options.device.mac,
                         "channel": options.device.channel,
                         "signal_level": options.device.signal_level,
                         "security": options.device.security,
                     }};
    request.post({
                  url: options.hiveempire_host || hiveempire_host,
                  json: send_data
                });

    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
    console.log('Connection closed');
  });

}

module.exports = sniff
var data = {hiveempire_host: 'http://localhost:8009/v1/event/',
            device: {mac: 'a2:05:43:a1:7f:1c',
                     ssid: 'KROJ',
                     channel: '36,+1',
                     signal_level: '-71',
                     security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'}}
sniff('192.168.4.1', data);