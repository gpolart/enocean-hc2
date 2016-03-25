//
// This file must be copied in config.js and variables should be set to correct values for your env.
//

var config = {};

config.enocean = {
                device       : "/dev/ttyUSB0",
                hc2_user     : "admin",
                hc2_passwd   : "SECRET",
                hc2_protocol : "http",
                hc2_name     : "sauron",    // Home Center is propietary software, so Sauron is a good name ;-)
                filename     : "ehc2.txt"
                };
//
module.exports = config;
