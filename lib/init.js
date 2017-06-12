var config = require('../lib/config')
require('colors')

// check for config file
if (config.file === false) {
  console.log('Error: config file not found.'.red)
  process.exit(-1)
}

var database = require('../lib/database')

if (database === false) {
  console.log(
    'Error: database file not found: '.red + config.file.database.location
  )
  process.exit(-1)
}

var Command = require('../lib/command')
var cmd = new Command()
cmd.run(process.argv)
