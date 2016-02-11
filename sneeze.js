'use strict';

var hiveempire_host = 'http://api.hiveempire.com/v1/event/';

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
                         "sensor_id": options.network.mac,
                         "channel": options.network.channel,
                         "signal_level": options.network.signal_level,
                         "security": options.network.security,
                     }};

      // send the data
      debugger;
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
// var data = {"temp": "23", "humidity": "52"};
// var options = {hiveempire_host: 'http://localhost:8008/v1/event/',
//             sense: {id: '00000000d390eefe' },
//             network: {mac: 'a2:05:43:a1:7f:1c',
//                      ssid: 'KROJ',
//                      channel: '36,+1',
//                      signal_level: '-71',
//                      security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'}}
// sneeze(data, options).then(function (data) { console.log(data); });
