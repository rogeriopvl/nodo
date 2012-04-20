/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 */

var CmdParser = function(){
    this.options = ['-v', '--version', '-h', '--help'];
    this.actions = ['add', 'delete'];
    this.actionOptions = ['-g', '--group'];
};

CmdParser.prototype.run = function(args){
    if (args.length < 3){
        this.showHelp();
    }

    // check for default options
    if (this.options.indexOf(args[2]) !== -1){
        if (args[2] === '-v' || args[2] === '--version'){
            this.showVersion();
            process.exit(0);
        }
        if (args[2] === '-h' || args[2] === '--help'){
            this.showHelp();
            process.exit(0);
        }
    }

    // check for actions
    if (this.actions.indexOf(args[2]) !== -1){
        switch(args[2]){
            case 'add':
                console.log('Adding task.');
                break;
            case 'delete':
                console.log('Deleting task.');
                break;
        }
    }
};

CmdParser.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [option]'); // TODO
};

CmdParser.prototype.showVersion = function(){
    console.log('Version 0.0.1'); // TODO
};

module.exports = CmdParser;
