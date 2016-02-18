'use strict';
/**
* SNEEZE - Exactly as it sounds
* Module is responsible for sending acquired sensor data to the api consumer
*/
var hiveempire_host = 'http://api.hiveempire.com/v1/event/';

var Promise = require('promise');
var request = require('request');
var tissue = require('./tissue');

function sneeze (data, options) {

  var promise = new Promise(function (resolve, reject) {
      var sensor_action = Object.keys(data);

      // if we pass send_data in via the options
      // it disregards the primary data as we dont have the lookups necessarily
      if (options.send_data === undefined) {
        var send_data = {
                          "api_version": 2,
                          "timestamp": new Date().getTime(),
                          // sensor_action must NOT be a list it must be a string
                          "sensor_action": sensor_action.toString(), // temp gets converted to temperature on the server side
                          "tags": {
                              "device_id": options.sense.id,
                              "sensor_id": options.network.mac,
                              "channel": options.network.channel,
                              "signal_level": options.network.signal_level,
                              "security": options.network.security,
                          }
                        };

        // dynamically add the sensor actions to the payload
        // the names are converted to the "correct" names on the server side
        sensor_action.forEach(function (item) {
          send_data[item] = data[item];
        });
      } else {
        // came in from a previous attempt and was saved to database
        var send_data = options.send_data;
      }

      // send the data
      console.log('----------------------------')
      console.log('Sending Data');
      console.log('----------------------------')
      console.log(send_data);
      console.log('----------------------------')
      request.post({
        url: options.hiveempire_host || hiveempire_host,
        json: send_data
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          // record as a tissue for sending later
          if (options.send_data === undefined) {
            // if it comes in from options.send_data it means
            // its come from the database
            tissue.save_tissue(send_data);
          }
          reject(err);
        } else {
          resolve(body);
        };
      });

  }); // end Promise

  return promise;
}

exports.sneeze = sneeze;
// var data = {"temp": "23", "humidity": "52"};
// var options = {hiveempire_host: 'http://localhost:8008/v1/event/',
//             sense: {id: '00000000d390eefe' },
//             network: {mac: 'a2:05:43:a1:7f:1c',
//                      ssid: 'KROJ',
//                      channel: '36,+1',
//                      signal_level: '-71',
//                      security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'}}
// sneeze(data, options).then(function (data) { console.log(data); });
