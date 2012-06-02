/**
 * Read nodo config file
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var path = require('path'),
    fs = require('fs'),
    config = {};

config.version = '0.2.1';
config.path = process.env.HOME + '/.nodorc';

var fileExists = path.existsSync(config.path, 'utf-8');

config.file = fileExists ? JSON.parse(fs.readFileSync(config.path, 'utf-8')) : false;

module.exports = config;
