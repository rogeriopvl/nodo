/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 */

var fs = require('fs');
var color = require('colors');

var List = require('../lib/list.js');
var Task = require('../lib/task.js');

var Command = function(){
    this.list = new List();
    this.task = new Task();
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

    this.readConfig();
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
        case 'done':
            this.done(major, minor);
            break;
        default:
            return this.showHelp();
    }
};

Command.prototype.show = function(major, minor){
    if (major === 'lists'){
        this.list.getAll(function(rows){
            for (var i in rows){
                console.log(rows[i].name + ' (' + rows[i].totalTasks  + ')');
            }
        });
    }
    else if (major.length > 0){
        // lets assume its a list name
        this.list.getByName(major, function(listTasks){
            if (listTasks.length < 1){
                console.log('This list is empty.'.yellow);
            }
            else{
                for (var j in listTasks){
                    console.log("(" + listTasks[j].id + ') ' + listTasks[j].name); 
                }
            }
        });
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

Command.prototype.done = function(major, minor){
    if (this.storage.hasList(major)){
        if (this.storage.doneTask(major, minor)){
            console.log('Task #' + minor + ' marked as done.');
        }
        else{
            console.log('Task #' + minor + ' does not exist.'.red);
        }
    }
    else{
        console.log('List does not exist.'.red);
    }
};

Command.prototype.remove = function(major, minor){
    if (major === 'list'){
        this.storage.deleteList(minor);
    }
    else{
        if (this.storage.deleteTask(major, minor)){
            console.log('Deleting task ' + minor + ' in ' + major);
        }
        else{
            console.log('Error could not delete task.'.red);
        }
    }
};

Command.prototype.showOverview = function(){
    for (var i in this.storage.lists){
        console.log(i + ':');
        if (this.storage.lists[i].length < 1){
            console.log('  This list is empty.'.yellow);
        }
        for (var j in this.storage.lists[i]){
            console.log("  (" + j + ') ' + this.storage.lists[i][j].title);
        }
    }
};

Command.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [option]'); // TODO
};

Command.prototype.showVersion = function(){
    console.log('Version 0.0.1'); // TODO
};

Command.prototype.readConfig = function(){
    var config = JSON.parse(fs.readFileSync(process.env['HOME'] + '/.nodorc', 'utf-8'));
    global.config = config;
};

module.exports = Command;
