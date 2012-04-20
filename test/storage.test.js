var Storage = require('../lib/storage');
var path = require('path');

module.exports = {

    testCreateFileOnStartup: function(test){
        var testFile = '/Users/rogeriopvl/Documents/projects/nodo/nodo.db';
        var storage = new Storage(testFile);
        test.ok(path.existsSync(testFile));
        test.done();
    },

    testReadFileOnStartup: function(test){
        var testFile = '/Users/rogeriopvl/Documents/projects/nodo/nodo.db';
        var storage = new Storage(testFile);
        testTasks = [
            {
                id: 1,
                message: 'testing message 1'
            },
            {
                id: 2,
                message: 'testing message 2'
            }
        ];
        storage.tasks = testTasks;
        storage.save();

        storage = undefined;
        var storage2 = new Storage(testFile);
        test.deepEqual(storage2.tasks, testTasks);
        test.done();
    }

};
