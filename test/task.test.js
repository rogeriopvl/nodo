var database = require('../lib/database');
var Task = require('../lib/task');

module.exports = {

    setUp: function(callback){
        this.task = new Task();
        callback();
    },

    testAdd: function(test){
        var newTask = {list: 'inbox', name: 'testing', dueDate: 0};
        this.task.add(newTask, function(err, result){
            test.ifError(err);
            test.ok(result.lastId);
            test.done();
        });
    },

    testGet: function(test){
        test.done();
    }
};
