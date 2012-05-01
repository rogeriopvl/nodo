var Storage = require('../lib/storage');
var path = require('path');

module.exports = {

    setUp: function(callback){
        this.testFile = '/tmp/nodo.db';
        callback();
    },

    tearDown: function(callback){
        // cleanup
        callback();
    },

    testCreateFileOnStartup: function(test){
        var storage = new Storage(this.testFile);
        test.ok(path.existsSync(this.testFile));
        test.done();
    },
    
    testHasInboxListOnStartup: function(test){
        var storage = new Storage(this.testFile);
        test.ok(storage.lists.inbox);
        test.done();
    },

    testReadFileOnStartup: function(test){
        var storage = new Storage(this.testFile);
        testTasks = {
            "inbox": [ { "title": "task1" } ]
        };
        storage.lists = testTasks;
        storage.save();

        storage = undefined;
        var storage2 = new Storage(this.testFile);
        test.deepEqual(storage2.lists, testTasks);

        // clean the file for the next tests
        storage2.lists = { "inbox": [] };
        storage2.save();

        test.done();
    },

    testHasList: function(test){
        var storage = new Storage(this.testFile);
        test.ok(storage.hasList('inbox'));

        storage.lists.testlist = [];
        test.ok(storage.hasList('testlist'));

        test.done();
    },

    testAddList: function(test){
        var storage = new Storage(this.testFile);
        
        storage.addList('testlist');
        test.ok(storage.hasList('testlist'));
        test.ok(storage.lists.testlist);

        // test adding already existing lists
        test.ok(!storage.addList('inbox'));
        test.ok(!storage.addList('testlist'));

        // clean the file for the next tests
        storage.lists = { "inbox": [] };
        storage.save();

        test.done();
    },

    testDeleteList: function(test){
        var storage = new Storage(this.testFile);

        // testing with one list
        storage.addList('testlist');
        storage.deleteList('testlist');
        test.ok(!storage.hasList('testlist'));
        test.ok(!storage.lists.testlist);

        // there should be 1 list after removing this one
        test.equal(Object.keys(storage.lists).length, 1);

        // testing adding 3 lists and removing the middle one
        storage.addList('list1');
        storage.addList('list2');
        storage.addList('list3');
        storage.deleteList('list2');
        test.ok(!storage.hasList('list2'));
        test.ok(!storage.lists.list2);

        // there should be 3 lists after removing this one
        test.equal(Object.keys(storage.lists).length, 3);

        // test removing 2 items in a row
        storage.deleteList('list1');
        storage.deleteList('list3');
        test.ok(!storage.hasList('list1'));
        test.ok(!storage.lists.list1);
        test.ok(!storage.hasList('list3'));
        test.ok(!storage.lists.list3);

        test.equal(Object.keys(storage.lists).length, 1);

        // test delete non existant item
        test.ok(!storage.deleteList('list3'));

        // clekn the file for the next tests
        storage.lists = { "inbox": [] };
        storage.save();

        test.done();
    },

    testAddTask: function(test){
        var storage = new Storage(this.testFile);
        test.ok(storage.addTask('inbox', 'task1'));
        test.equal(storage.lists.inbox.length, 1);
        test.equal(storage.lists.inbox[0].title, 'task1');

        // add task to non existant list
        test.ok(!storage.addTask('lulz', 'task2'));

        test.done();
    },

    testDeleteTask: function(test){
        var storage = new Storage(this.testFile);
        test.ok(storage.deleteTask('inbox', 0));
        test.equal(storage.lists.inbox.length, 0);
        test.done();
    },

    testGetTasksByList: function(test){
        var storage = new Storage(this.testFile);
        storage.addTask('inbox', 'task1');
        storage.addTask('inbox', 'task2');

        var inboxTasks = storage.getTasksByList('inbox');
        test.equal(inboxTasks.length, 2);
        test.equal(inboxTasks[0].title, 'task1');
        test.equal(inboxTasks[1].title, 'task2');

        test.done();
    }

};
