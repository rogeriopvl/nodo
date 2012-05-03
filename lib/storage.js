/**
 * Takes care of task and lists storage and manipulation
 */

var fs = require('fs');
var path = require('path');

var Task = require('../lib/task.js');

var Storage = function(filePath){
    this.filePath = filePath; // TODO: throw exception in undefined
    if (path.existsSync(this.filePath)){
        this.lists = this.read();
    }
    else{
        this.lists = {};
        this.lists.inbox = [];
        this.save();
    }
    this.archive = null;
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
        if (index in this.lists[list]){
            // delete leaves "null" on arrays so we use splice
            this.lists[list].splice(index, 1);
            this.save();
            return true;
        }
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

/**
 * Marks a task as done.
 * Currently this is removing the task from its position in the list
 * and re-adds it to the bottom so that we can break of loops when fetching
 * undone tasks, slightly improving performance (inpired by the LRU algorithm).
 * This should change in the future. A better approach would be using a separate
 * database file for archived items, to avoid huge files.
 */
Storage.prototype.doneTask = function(list, index){
    if (this.hasList(list)){
        if (index in this.lists[list]){
            var doneTask = this.lists[list].splice(index, 1);
            doneTask.done = true;
            doneTask.doneAt = Date.now();
            // place it in the bottom
            this.lists[list].push(doneTask);
        }
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
