var fs = require('fs')
var aux = require('../lib/aux')
var config = {}

config.path = process.env.HOME + '/.nodorc'

var fileExists = fs.existsSync(config.path, 'utf-8')

config.file = fileExists
  ? JSON.parse(fs.readFileSync(config.path, 'utf-8'))
  : false

if (config.file) {
  config.file.database.location = aux.expand(config.file.database.location)
}

module.exports = config
