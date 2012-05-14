/**
 * Takes care of all initialization tasks
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    config = require('../lib/config');

// check for config file
if (false === config.file){
    console.log('Error: config file not found.'.red);
    process.exit(-1);
}

var database = require('../lib/database');

if (false === database){
    console.log('Error: database file not found: '.red + config.file.database.location);
    process.exit(-1);
}

var Command = require('../lib/command');
var cmd = new Command();
cmd.run(process.argv);
