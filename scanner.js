'use strict';
/**
* SCANNER - Primary entry point for the whole process
* Extract config, set constants
* instantiate sniff
* instantiate sneeze
*/
var config = require('config');

// Get the passed in HiveEmpire-Sense device id
require('getmac').getMac(function (err, macAddress) {
  if (err)  throw err;

  //
  // Get Mac Address for this Device
  //
  var hiveempire_sense_device_id = macAddress;
  console.log('macAddress: '+ hiveempire_sense_device_id)
  //
  // Config
  //
  var debug = config.get('debug')
  var api = config.get('api')

  var ssid_identifier = config.get('ssid_identifier');
  var default_sensor_ip = config.get('default_sensor_ip');
  var sense_device = {id: hiveempire_sense_device_id}

  var default_access_point = config.get('access_point');
  var access_point = {
    "ssid": default_access_point.ssid,
    "password": default_access_point.password
  }
  //
  // End Config
  //
  var WiFiControl = require('wifi-control');
  var request = require('request');
  var sleep = require('sleep');
  var sniff = require('./sniff')
  var sneeze = require('./sneeze')
  var tissue = require('./tissue')

  //  Initialize wifi-control package with verbose output
  WiFiControl.init({
    debug: debug
  });

  //  Try scanning for access points:
  WiFiControl.scanForWiFi( function(err, response) {
    if (err) throw err;

    if (response.success === true) {
      // loop over the list of networks
      response.networks.forEach(function (network) {
        /**
          { mac: 'a2:05:43:a1:7f:1c',
            ssid: 'KROJ',
            channel: '36,+1',
            signal_level: '-71',
            security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)'
          }
        */
        if ( network.ssid.indexOf(ssid_identifier) != -1) {
          console.log('Matched SSID: ' + network.ssid);

          // update the ssid
          access_point.ssid = network.ssid;

          // connect to the Access point
          var results = WiFiControl.connectToAP( access_point );

          // if we have a success
          if (results.success === true) {
            sleep.sleep(2);

            // Try to sniff the sensor data from the ip
            sniff.sniff(default_sensor_ip)
            .then(function (data) {
              console.log(data);

              // send the json data from the sensor as well as the device info
              sneeze.sneeze(data, {
                'hiveempire_host': api.event,
                'sense': sense_device,
                'network': network
              })
              .then(function (resp) {
                console.log(resp);
              }); // end sneeze promise

            }); // end sniff promiss

          } // end result.success

        } else { // ssid match if
          access_point.ssid = null;
          console.log('No match for SSID: ' + network.ssid + ' signal_level: ' + network.signal_level + ' security: ' + network.security)
        } // end ssid match if

      }); // end loop over networks

    } // end response.success
    /**
    * Try to send any previously captured tissues
    */
    console.log('End Scan')
    tissue.send_tissues().then(function (resp) { console.log(resp); });
  }); // end WifiControl.Scan

  //WiFiControl.resetWiFi()

});
