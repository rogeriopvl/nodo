/**
 * Takes care of all initialization tasks
 */

var path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    config = require('../lib/config');

// check for config file
if (false === config.file){
    console.log('Config file not present.'.yellow + ' Creating one in ' + config.path + ' ...');
    console.log('Note that you should edit this file after, to ensure you are using the correct database.');
    var configContent = fs.readFileSync('samples/nodorc_sample', 'utf-8');
    fs.writeFileSync(config.path, configContent, 'utf-8');
}

var database = require('../lib/database');

if (false === database){
    console.log('Database file not found. If this is your first run and you don\'t want to use a Wunderlist database, use "nodo-install-db" to create a local database.'.red);
    process.exit(-1);
}

var Command = require('../lib/command');
var cmd = new Command();
cmd.run(process.argv);
