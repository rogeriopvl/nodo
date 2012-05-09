/**
 * This module reads the nodo config file
 */

var fs = require('fs'),
    config = JSON.parse(fs.readFileSync(process.env.HOME + '/.nodorc', 'utf-8'));

module.exports = config;
