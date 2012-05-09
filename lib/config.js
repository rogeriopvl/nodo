/**
 * This module reads the nodo config file
 */

var fs = require('fs'),
    path = require('path'),
    config = {};
    config.version = '0.0.1';

var fileExists = path.existsSync(process.env.HOME + '/.nodorc', 'utf-8');

// check if config file exists... if not create a default one.
if (fileExists){
    config.file = JSON.parse(fs.readFileSync(process.env.HOME + '/.nodorc', 'utf-8'));
}
else{
    console.log('Config file not present.'.red);
    console.log('If this is your first run, create a .nodorc file in your home directory with the following content:\n');
    console.log('{\n  "database": {');
    console.log('    "location": "~/.nodo.db"');
    console.log('  }\n}\n');
    console.log('Note that you should edit that file after, to ensure you are using the correct database.');
    process.exit(-1);
}

module.exports = config;
