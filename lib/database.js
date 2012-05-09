/**
 * Initializes the database connection
 */

var config = require('../lib/config'),
    sqlite = require('sqlite3').verbose(),
    database = new sqlite.Database(config.database.location);

module.exports = database;
