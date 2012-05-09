/**
 * Initializes the database connection
 */

var config = require('../lib/config'),
    sqlite = require('sqlite3').verbose(),
    path = require('path'),
    database = null;

// need to check file existence because sqlite creates empty file
var fileExists = path.existsSync(config.file.database.location);

if (fileExists){
    database = new sqlite.Database(config.file.database.location);
}
else{
    console.log('Error: unable to find database file. Check your config file.'.red);
    process.exit(-1);
}

module.exports = database;
