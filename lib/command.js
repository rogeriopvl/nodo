/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 */

var Storage = require('../lib/storage');

var Command = function(){
    this.storage = new Storage();
};

Command.prototype.run = function(args){

    args.splice(0, 2); // removing interpreter and file name
    
    var command = args.shift();
    var major = args.shift();
    var minor = args.length < 1 ? null : args.join(' ');
    
    if (typeof command === 'undefined' || !command){
        this.showLists();
        process.exit(0);
    }

    this.delegate(command, major, minor);
};

Command.prototype.delegate = function(command, major, minor){
    switch(command){
        case 'add':
            this.add();
            break;
        case 'delete':
            //return this.delete;
        default:
            return this.showHelp();
    }
};

Command.prototype.showLists = function(){
    console.log('Showing lists');
    // TODO
};

Command.prototype.add = function(list, title){
    var title = title || 'inbox';
    console.log('Adding '+title+' to '+list);
    // TODO
};

Command.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [option]'); // TODO
};

Command.prototype.showVersion = function(){
    console.log('Version 0.0.1'); // TODO
};

module.exports = Command;
