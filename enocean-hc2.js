// =====================================================================
// Copyright Gilles Polart-Donat 2016
//
// enocean-hc2 is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    enocean-hc2 is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//    You should have received a copy of the GNU General Public License
//    along with enocean-hc2.  If not, see <http://www.gnu.org/licenses/>.
// ======================================================================

var debug  = require('debug')('enocean-hc2');
var enocean  = require('node-enocean')();
var request  = require('request');
var yaml  = require('yamljs');
var fs = require('fs');
var config  = require('./config.js');
//var async  = require('async.js');
//
var read_active = false;
var packets = {};
//=========================================================================================
// Utilities to stop process correctly
//-----------------------------------------------------------------------------------------
function exitHandler(options, err) {
	debug("exitHandler   options : ", options);
	if (options.exit) process.exit();
}
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// ---------------------------------------------------------------------------
// read_packets
// ---------------------------------------------------------------------------
function read_packets() {

    if (fs.existsSync(config.enocean.filename)) {
        packets= yaml.load(config.enocean.filename);
    }
    else {
        packets = {};
    }
    debug("read packets = ",packets);
}
    
// ---------------------------------------------------------------------------
// store_packets
// ---------------------------------------------------------------------------
function store_packets() {
    debug("path  = ",config.enocean.filename);
    debug("store packets = ",packets);
    var str = yaml.stringify(packets);
    fs.writeFileSync(config.enocean.filename, str);
}
// ---------------------------------------------------------------------------
// record data
// ---------------------------------------------------------------------------
function record_data(data) {
	debug("record_variable .... ident = ", data);

    var key = data.senderId + "-" + data.choice + "-" + data.raw;
    var date = new Date();
    var store_wanted = false;

    if (!packets.hasOwnProperty(key)) {
        packets[key] = { label : "unknown", actions : {nop : "something to do"} };
        store_wanted = true;
    }
    packets[key].lastseen = date.getTime();
    packets[key].raw = data.rawByte;

    var act;
    for (act in packets[key].actions) {
        debug("do action ", act);
        debug("do action ", packets[key].actions[act]);
        if (act !== 'nop') {
            do_request(packets[key].actions[act]);
        }
    }

    if (store_wanted) {
        store_packets();
    }
}

function do_request(args) {

    var headers = {
        'User-Agent' :    'enocean-hc2'
    };

    var options = {
        url : config.enocean.hc2_protocol + '://' + config.enocean.hc2_user + ":" + config.enocean.hc2_passwd + "@" + config.enocean.hc2_name + '/api/callAction?' + args,
        method : 'GET',
        headers : headers
    }

    request(options, function(err, resp, body) {
        debug("err = " + err);
        debug("body = " + body);
        // TODO test return of request
    });
}
// ----------------------------------------------------------------------------------------
// Log messages as a variable
// ----------------------------------------------------------------------------------------
function log_message(msg) {
    debug("log_message ... ");

    //record_variable("enocean.logs", msg);
}
//=========================================================================================
// Main server initialize
//-----------------------------------------------------------------------------------------
function start(options) {
	debug("========  enocean-agent starting ==========");
	log_message(" enocean-agent starting ...");

    path = config.filename;
    read_packets();

    debug("options = ", options);
    enocean.listen(options.device);



    enocean.on("data", function(data) {
        //debug("data = ", data);
        record_data(data)
    });

}

start(config.enocean);
