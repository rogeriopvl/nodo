/**
 * Stores and retrieves all tasks
 */

var fs = require('fs');
var path = require('path');

var Storage = function(filePath){
    this.filePath = filePath;
    if (path.existsSync(this.filePath)){
        this.tasks = this.read();
    }
    else{
        this.tasks = [];
    }

};

Storage.prototype.read = function(){
    return fs.readFileSync(this.filePath,'utf-8');
};

Storage.prototype.save = function(){
    var jsonData = JSON.stringify(this.tasks);
    fs.writeFileSync(this.filePath, jsonData, 'utf8');
};

module.exports = Storage;
