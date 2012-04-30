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
        this.lists = {};
        this.lists.inbox = [];
        this.save();
    }
};

Storage.prototype.hasList = function(name){
    return name in this.lists;
};

Storage.prototype.addTask = function(list, title){
    if (this.hasList(list)){
        var newTask = new Task(title);
        this.lists[list].push(newTask);
        this.save();
        return true;
    }
    return false;
};

Storage.prototype.deleteTask = function(list, index){
    if (this.hasList(list)){
        // TODO check for index existence
        delete this.lists[name][index];
        this.save();
        return true;
    }
    return false;
};

Storage.prototype.addList = function(name){
    if (this.hasList(name)){
        return false;
    }
    this.lists[name] = [];
    this.save();

    return true;
};

Storage.prototype.deleteList = function(name){
    if (this.hasList(name)){
        delete this.lists[name];
        this.save();
        return true;
    }
    return false;
};

Storage.prototype.getTasksByList = function(list){
    if (this.hasList(list)){
        return this.lists[list];
    }
    return false;
};

Storage.prototype.read = function(){
    return JSON.parse(fs.readFileSync(this.filePath,'utf-8'));
};

Storage.prototype.save = function(){
    var jsonData = JSON.stringify(this.lists);
    fs.writeFileSync(this.filePath, jsonData, 'utf8');
};

module.exports = Storage;
