/**
 * Read nodo config file
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var fs = require('fs'),
    config = {};

config.version = '0.3.1';
config.path = process.env.HOME + '/.nodorc';

var fileExists = fs.existsSync(config.path, 'utf-8');

config.file = fileExists ? JSON.parse(fs.readFileSync(config.path, 'utf-8')) : false;

module.exports = config;
