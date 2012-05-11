/**
 * Initializes the database connection
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var config = require('../lib/config'),
    sqlite = require('sqlite3').verbose(),
    path = require('path'),
    database = false,
    fileExists = false;

if (config.file){
    // this sucks, path.normalize should  accept the home alias...
    var databaseLocation = config.file.database.location.replace(/~\//g, process.env.HOME + '/');
    fileExists = path.existsSync(databaseLocation);
}

if (fileExists){
    database = new sqlite.Database(databaseLocation);
}

module.exports = database;
