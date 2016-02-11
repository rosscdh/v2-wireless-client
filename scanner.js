'use strict';

var ssid_identifier = 'he-'

var target_host = '192.168.4.1';

var _ap = {
  "ssid": null,
  "password": "12345678"
};

var WiFiControl = require('wifi-control');
var request = require('request');
var sniff = require('./sniff')

//  Initialize wifi-control package with verbose output
WiFiControl.init({
  debug: true
});

//  Try scanning for access points:
WiFiControl.scanForWiFi( function(err, response) {
  if (err) console.log(error);

  if (response.success === true) {
    response.networks.forEach(function (network) {
      /**
      { mac: 'a2:05:43:a1:7f:1c',
        ssid: 'KROJ',
        channel: '36,+1',
        signal_level: '-71',
        security: 'WPA(PSK/TKIP/TKIP) WPA2(PSK/AES/TKIP)' }
      */
      if ( network.ssid.indexOf(ssid_identifier) != -1) {
        // update the ssid
        _ap.ssid = network.ssid;

        // connect to the Access point
        var results = WiFiControl.connectToAP( _ap );

        // if we have a success
        if (results.success === true) {

          sniff(target_host, {
            hiveempire_host: 'http://localhost:8009/v1/event/',
            device: network
          });

        } // end result.success

      }

    });
  }
});
