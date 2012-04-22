/**
 * Main interface for the application
 */

var Nodo = function(){};

Nodo.prototype.listTasks = function(deleted, list){
    deleted = deleted || false;
    list = list || 'inbox';

    // TODO
    console.log('TODO');
};

Nodo.prototype.addTask = function(title, list){
    list = list || 'inbox';

    // TODO
    console.log('TODO');
};

Nodo.prototype.deleteTask = function(id){
    //TODO
    console.log('TODO');
};

module.exports = Nodo;
