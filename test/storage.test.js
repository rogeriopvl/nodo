var Storage = require('../lib/storage');
var path = require('path');

module.exports = {

    setUp: function(callback){
        this.testFile = '/Users/rogeriopvl/Documents/projects/nodo/nodo.db';
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
        test.done();
    },

    testDeleteList: function(test){
        var storage = new Storage(this.testFile);

        // testing with one list
        storage.addList('testlist');
        storage.deleteList('testlist');
        test.ok(!storage.hasList('testlist'));
        test.ok(!storage.lists.testlist);

        // testing adding 3 lists and removing the middle one
        storage.addList('list1');
        storage.addList('list2');
        storage.addList('list3');
        storage.deleteList('list2');
        test.ok(!storage.hasList('list2'));
        test.ok(!storage.lists.list2);

        // there should be 3 lists after removing this one
        test.equal(Object.keys(storage.lists).length, 3);

        test.done();
    }

};
