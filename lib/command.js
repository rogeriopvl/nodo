/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 */

var Storage = require('../lib/storage');
var color = require('colors');

var Command = function(){
    this.storage = new Storage('./nodo.db');
};

Command.prototype.run = function(args){

    args.splice(0, 2); // removing interpreter and file name
    
    var command = args.shift();
    var major = args.shift();
    var minor = args.length < 1 ? null : args.join(' ');
    
    if (typeof command === 'undefined' || !command){
        this.showHelp();
        process.exit(0);
    }

    this.delegate(command, major, minor);
};

Command.prototype.delegate = function(command, major, minor){
    switch(command){
        case 'show':
            this.show(major, minor);
            break;
        case 'add':
            this.add(major, minor);
            break;
        case 'delete':
            this.remove(major, minor);
            break;
        default:
            return this.showHelp();
    }
};

Command.prototype.show = function(major, minor){
    if (major === 'lists'){
        console.log('Task Lists:');
        for (var i in this.storage.lists){
            var numTasks = this.storage.lists[i].length;
            console.log("\t" + i + ' (' + numTasks  + ')');
        }
    }
    else if (this.storage.hasList(major)){
        var listTasks = this.storage.getTasksByList(major);
        console.log(major + ':');
        for (var j in listTasks){
            console.log("\t(" + j + ') ' + listTasks[j].title); 
        }
    }
    else{
        this.showOverview();
    }
};
Command.prototype.add = function(major, minor){
    if (major === 'list'){
        if (this.storage.addList(minor)){
            console.log('Added new list '.green + minor.blue);
        }
        else{
            console.log('List already exists'.red);
        }
    }
    else{
        if (this.storage.addTask(major, minor)){
            console.log('Added new task to '.green + major.blue);
        }
        else{
            console.log('Error adding task to '.red + major.blue);
        }
    }
};

Command.prototype.remove = function(major, minor){
    if (major === 'list'){
        this.storage.deleteList(minor);
    }
    else{
        //this.storage.deleteTask(major, minor);
        // TODO
    }
};

Command.prototype.showOverview = function(){
    for (var i in this.storage.lists){
        
    }
};

Command.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [option]'); // TODO
};

Command.prototype.showVersion = function(){
    console.log('Version 0.0.1'); // TODO
};

module.exports = Command;
