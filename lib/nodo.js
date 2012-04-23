/**
 * Main interface for the application
 */

var Storage = require('../lib/storage');

var Nodo = function(){
    this.storage = new Storage('./nodo.db');
};

Nodo.prototype.listTasks = function(list, deleted){
    list = list || 'inbox';
    deleted = deleted || false;

    // TODO
    console.log('TODO');
};

Nodo.prototype.addTask = function(title, list){
    list = list || 'inbox';

    var newTask = {
        id: '', // TODO
        title: title,
        list: list,
        createdAt: Date.now()
    };
    this.storage.tasks.push(newTask);
    this.storage.save();
    console.log(typeof this.storage);
};

Nodo.prototype.deleteTask = function(id){
    //TODO
    console.log('TODO');
};

module.exports = Nodo;
