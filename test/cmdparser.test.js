var CmdParser = require('../lib/cmdparser');

module.exports = {

    testShowHelpWithNoParams: function(test){
        var cp = new CmdParser();
        var fakeArgs = ['node', 'foobar'];
        cp.run(fakeArgs);
        test.ok(); // TODO
        test.done();
    }
};
