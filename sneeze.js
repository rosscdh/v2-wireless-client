'use strict';

var hiveempire_host = 'http://localhost:8009/v1/event/';

var Promise = require('promise');
var request = require('request');


function sneeze(data, options) {

  var promise = new Promise(function (resolve, reject) {

      var send_data = {"source": null,
                     "sensor_action": "temperature,humidity",
                     "temperature": data.temp,
                     "humidity": data.humidity,
                     "tags": {
                         "device_id": options.sense.id,
                         "sensor_id": options.device.mac,
                         "channel": options.device.channel,
                         "signal_level": options.device.signal_level,
                         "security": options.device.security,
                     }};

      // send the data
      request.post({
        url: options.hiveempire_host || hiveempire_host,
        json: send_data
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) reject(err);
        resolve(body);
      });

  }); // end Promise

  return promise;
}

module.exports = sneeze
var data = {hiveempire_host: 'http://localhost:8008/v1/event/',
            sense: {id: '00000000d390eefe' },
            device: {mac: 'a2:05:43:a1:7f:1c',
                     ssid: 'KROJ',
                     channel: '36,+1',
                     signal_level: '-71',
                     security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'}}
sneeze(data).then(function (data) { console.log(data); });
