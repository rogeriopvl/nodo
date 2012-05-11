/**
 * Read nodo config file
 */

var fs = require('fs'),
    path = require('path'),
    config = {};

config.version = '0.1.2';
config.path = process.env.HOME + '/.nodorc';

var fileExists = path.existsSync(config.path, 'utf-8');

config.file = fileExists ? JSON.parse(fs.readFileSync(config.path, 'utf-8')) : false;

module.exports = config;
