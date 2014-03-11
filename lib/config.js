/**
 * Read nodo config file
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var fs = require('fs'),
    aux = require('../lib/aux'),
    config = {};

config.path = process.env.HOME + '/.nodorc';

var fileExists = fs.existsSync(config.path, 'utf-8');

config.file = fileExists ? JSON.parse(fs.readFileSync(config.path, 'utf-8')) : false;

if (config.file) {
    config.file.database.location = aux.expand(config.file.database.location);
}

module.exports = config;
