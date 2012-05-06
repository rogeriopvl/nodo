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
    else if (major){
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
        this.list.add(minor, function(result){
            if (result.success){
                console.log('Added list ' + minor);
            }
            else{
                console.log('Error: '.red + result.error.red);
            }
        });
    }
    else{
        var newTask = { list: major, name: minor };
        this.task.add(newTask, function(result){
            if (result.success){
                console.log('Added new task to ' + major.blue);
            }
            else{
                console.log('Error adding task to '.red + major.yellow);
            }
        });
    }
};

Command.prototype.done = function(major, minor){
    this.task.setDone(taskId, function(result){
        if (result.success){
            console.log('Task #' + major + ' marked as done.');
        }
        else{
            console.log('Error: '.red + result.error.red);
        }
    });
};

Command.prototype.remove = function(major, minor){
    if (major === 'list'){
        this.list.remove(listName, function(result){
            if (result.success){
                console.log('List ' + minor + ' deleted.');
                // TODO what todo with the orfan tasks
            }
            else{
                console.log('Error: '.red + result.error.red);
            }
        });
    }
    else{
        // allow alias for delete task #
        var taskId = major === 'task' ? minor : major;
        this.task.remove(taskId, function(result){
            if (result.success){
                console.log('Task #' + taskId + ' deleted.');
            }
            else{
                console.log('Error: '.red + result.error.red);
            }
        });
    }
};

Command.prototype.showOverview = function(){
    this.task.getToDo(function(rows){
        var currentList = null;
        for (var i in rows){
            if (currentList !== rows[i].listName){
                currentList = rows[i].listName;
                console.log(rows[i].listName + ':');
            }
            console.log('  (' + rows[i].id + ') ' + rows[i].name);
        }
    });
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
