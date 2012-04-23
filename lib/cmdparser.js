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
        process.exit(0);
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
    else if (this.actions.indexOf(args[2]) !== -1){
        var Nodo = require('../lib/nodo');
        var nodo = new Nodo();

        var action = args[2];
        args.splice(0, 3);

        switch(action){
            case 'ls':
                if (args.length > 1 && (args[0] === '-a' || args[0] === '--all')){
                    nodo.listTalks(args[0]);
                }
                nodo.listTasks();
                break;
            case 'add':
                if (args.length < 1){
                    this.showHelp();
                    process.exit(0);
                }
                var addArgs = this.parseAdd(args);
                console.log('Adding task ' + addArgs.title);
                nodo.addTask(addArgs.title, addArgs.list);
                break;
            case 'delete':
                if (args.length < 1){
                    this.showHelp();
                    process.exit(0);
                }
                console.log('Deleting task ' + args[3]);
                nodo.deleteTask(args[1]);
                break;
            default:
                this.showHelp();
                process.exit();
        }
    }
    else{
        this.showHelp();
    }
};

CmdParser.prototype.parseAdd = function(pargs){
    var list = null;
    var title = null;
    for (i in pargs){
        if (pargs[i].indexOf('+') !== -1){
            title = pargs.splice(0, i).join(' ');
            list = pargs.pop().replace(/\+/, '');
        }
        else{
            title = pargs.join(' ');
        }
    }
    return { title: title, list: list };
};

CmdParser.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [option]'); // TODO
};

CmdParser.prototype.showVersion = function(){
    console.log('Version 0.0.1'); // TODO
};

module.exports = CmdParser;
