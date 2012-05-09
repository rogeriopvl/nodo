/**
 * This module reads the nodo config file
 */

var fs = require('fs');

var config = JSON.parse(fs.readFileSync(process.env.HOME + '/.nodorc', 'utf-8'));

module.exports = config;
