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
    console.log('Config file not present.'.yellow + ' Creating one in ' + config.path + ' ...');
    console.log('Note that you should edit this file after, to ensure you are using the correct database.');
    var configContent = fs.readFileSync(__dirname + '/../samples/nodorc_sample', 'utf-8');
    fs.writeFileSync(config.path, configContent, 'utf-8');

    // remove the module cache, to update the new generated configs
    delete require.cache[__dirname + '/config.js'];
    var config = require('../lib/config');
}

var database = require('../lib/database');

if (false === database){
    console.log('Database file not found: '.red + config.database.location);
    process.exit(-1);
}

var Command = require('../lib/command');
var cmd = new Command();
cmd.run(process.argv);
