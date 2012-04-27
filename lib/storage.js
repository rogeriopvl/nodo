/**
 * Takes care of task and lists storage and manipulation
 */

var fs = require('fs');
var path = require('path');

var List = require('../lib/list.js');
var Task = require('../lib/task.js');

var Storage = function(filePath){
    this.filePath = filePath; // TODO: throw exception in unefined
    if (path.existsSync(this.filePath)){
        this.lists = this.read();
    }
    else{
        this.lists = [];
        var inbox = new List('inbox');
        this.lists.push(inbox);
        this.save();
    }
};

Storage.prototype.hasList = function(name){
    for (var i in this.lists){
        if (this.lists[i][name]){
            return true;
        }
    }
};

Storage.prototype.addTask = function(list, title){
    if (this.hasList(list)){
        for (var i in this.lists){
            if (this.lists[i].name === list){
                var newTask = new Task(title);
                this.lists[i][list].push(newTask);
                this.save();
                return true;
            }
        }
    }
    return false;
};

Storage.prototype.addList = function(name){
    if (this.hasList(name)){
        return false;
    }
    var newList = new List(name);
    this.lists.push(newList);
    this.save();
};

Storage.prototype.deleteList = function(name){
    // TODO
};

Storage.prototype.read = function(){
    return JSON.parse(fs.readFileSync(this.filePath,'utf-8'));
};

Storage.prototype.save = function(){
    var jsonData = JSON.stringify(this.lists);
    fs.writeFileSync(this.filePath, jsonData, 'utf8');
};

module.exports = Storage;
