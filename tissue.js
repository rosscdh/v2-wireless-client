'use strict';
/**
* TISSUE - Save the data in the case of failure
* Module is responsible for saving data to a db in the case of failure for later
*/
var config = require('config');
var Promise = require('promise');
var sneeze = require('./sneeze')

var knexInstance = require('knex')({
  client: 'sqlite3', // or what DB you're using
  connection: {
    filename     : './sensor_events.db',
  }
});

var debug = config.get('debug')
var api = config.get('api')

// Initialize Bookshelf by passing the Knex instance
var bookshelf = require('bookshelf')(knexInstance);

var SensorEvent = bookshelf.Model.extend({
  tableName: 'sensor_events'
});

/**
* Save an object into the database ebcause it could not be setn
*/
function save_tissue (data) {
  var promise = new Promise(function (resolve, reject) {
      var sensor_event = new SensorEvent({'data': JSON.stringify(data), 'date_of': new Date()});
      sensor_event.save(null, {method: 'insert'})
      resolve(sensor_event)
  }); // end Promise

  return promise;
}

/**
* Try to resend the saved issues
*/
function send_tissues () {
  var promise = new Promise(function (resolve, reject) {
    // get saved sensor events
    SensorEvent.fetchAll().then(function (collection) {
      // loop over collection
      collection.forEach(function (row) {
        // extract the data as json
        var send_data = JSON.parse(row.attributes.data);
        // set the date_of
        var date_of = row.attributes.date_of;
        // try to send the data again
        sneeze.sneeze({}, {
          'hiveempire_host': api.event,
          'send_data': send_data,
        })
        .then(function (resp) {
          console.log(resp);
          row.destroy();
          resolve(true)
        }); // end sneeze promise

      }); // end collection loop
    }); // end fetchAll
  }); // end Promise

  return promise;
}

exports.save_tissue = save_tissue;
exports.send_tissues = send_tissues;

// save_tissue({"api_version": 2,
//        "timestamp": new Date().getTime(),
//        // sensor_action must NOT be a list it must be a string
//        "sensor_action": 'temp,humidity', // temp gets converted to temperature on the server side
//        "temp": "23",
//        "humidity": "54",
//        "tags": {
//            "device_id": "00000000d390eefe",
//            "sensor_id": "fd:32:fds:6:33",
//            "channel": "36,+1",
//            "signal_level": "-71",
//            "security": "WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)",
//        }}).then(function (data) { console.log(data); });
//send_tissues()