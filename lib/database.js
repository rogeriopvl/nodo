/**
 * Initializes the database connection
 */

var config = require('../lib/config'),
    sqlite = require('sqlite3').verbose(),
    path = require('path'),
    database = false;

// need to check file existence because sqlite creates empty file
var fileExists = config.file ? path.existsSync(config.file.database.location) : false;

if (fileExists){
    database = new sqlite.Database(config.file.database.location);
}

module.exports = database;
