var Storage = require('../lib/storage');
var path = require('path');

module.exports = {

    'test CreateFileOnStartup': function(beforeExit, assert){
        var testFile = '/Users/rogeriopvl/Documents/projects/nodo/nodo.db';
        var storage = new Storage(testFile);
        assert.ok(path.existsSync(testFile));
    },

    'test ReadFileOnStartup': function(beforeExit, assert){
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
        assert.eql(storage2.tasks, testTasks);
    }

};
