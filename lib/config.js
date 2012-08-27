/**
 * Read nodo config file
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var fs = require('fs'),
    path = require('path'),
    path2nodoRC = process.env.HOME + '/.nodorc',
    packageJSON = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')),
    config = {
        version: packageJSON.version,
        path: path2nodoRC,
        file: false
    };

if (fs.existsSync(config.path)) {
    config.file = JSON.parse(fs.readFileSync(config.path, 'utf8'));
}

module.exports = config;
