var config = require('../lib/config')
var sqlite = require('sqlite3').verbose()
var fs = require('fs')
var database = false
var fileExists = false

if (config.file) {
  // this sucks, path.normalize should  accept the home alias...
  var databaseLocation = config.file.database.location.replace(
    /~\//g,
    process.env.HOME + '/'
  )
  fileExists = fs.existsSync(databaseLocation)
}

if (fileExists) {
  database = new sqlite.Database(databaseLocation)
}

module.exports = database
