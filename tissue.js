'use strict';
/**
* TISSUE - Save the data in the case of failure
* Module is responsible for saving data to a db in the case of failure for later
*/
var Promise = require('promise');

var knexInstance = require('knex')({
  client: 'sqlite3', // or what DB you're using
  connection: {
    filename     : './sensor_events.db',
  }
});
// Initialize Bookshelf by passing the Knex instance
var bookshelf = require('bookshelf')(knexInstance);

var SensorEvent = bookshelf.Model.extend({
  tableName: 'sensor_events'
});

function tissue (data) {
  var promise = new Promise(function (resolve, reject) {
      var sensor_event = new SensorEvent({data: data, date_of: new Date()});
      sensor_event.save()
  }); // end Promise

  return promise;
}

module.exports = tissue

tissue({"api_version": 2,
       // sensor_action must NOT be a list it must be a string
       "sensor_action": 'temp,humidity', // temp gets converted to temperature on the server side
       "temp": "23",
       "humidity": "54",
       "tags": {
           "device_id": "00000000d390eefe",
           "sensor_id": "fd:32:fds:6:33",
           "channel": "36,+1",
           "signal_level": "-71",
           "security": "WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)",
       }}).then(function (data) { console.log(data); });