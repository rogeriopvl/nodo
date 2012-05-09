/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 */

var fs = require('fs'),
    color = require('colors'),
    List = require('../lib/list'),
    Task = require('../lib/task');

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

    if (command === '-v' || command === '--version'){
        this.showVersion();
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
    else if (major === 'done'){
        this.task.getDone(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.rows.length < 1){
                console.log('No tasks are done yet. Are you slacking?'.yellow);
            }
            else{
                for (var i in result.rows){
                    var doneDate = new Date(result.rows[i].done_date * 1000);
                    var doneString = result.rows[i].listName.blue + '\tDone at: '.white;
                    doneString += doneDate.getDate() + '/' + doneDate.getMonth() + '/';
                    doneString += doneDate.getFullYear();
                    doneString += '\t(' + result.rows[i].id + ') ' + result.rows[i].name + '\t';
                    console.log(doneString);
                }
            }
        });
    }
    else if (major === 'all'){
        this.showOverview();
    }
    else if (major === 'task'){
        this.task.get(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (!result.row){
                console.log('Task #' + minor + ' does not exist.');
            }
            else{
                console.log('Task #' + result.row.id);
                console.log('List: ' + result.row.listName);
                console.log('Name: ' + result.row.name);
                console.log('Notes: ' + (result.row.notes ? result.row.notes : 'none'));
                console.log('Due Date: ' + (result.row.date ? result.row.date : 'none'));
                console.log('Done: ' + (result.row.done ? 'yes' : 'no'));
                console.log('Done Date: ' + (result.row.done_date ? result.row.done_date : 'none'));
                console.log('Deleted: ' + (result.row.deleted ? 'yes' : 'no'));
            }
        });
    }
    else if (major === 'deleted'){
        this.task.getDeleted(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (!result.rows || result.rows.length < 1){
                console.log('There are no deleted tasks.'.yellow);
            }
            else{
                for (var i in result.rows){
                    console.log('(' + result.rows[i].id + ') ' + result.rows[i].name);
                }
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
        // alias for show all
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
        this.task.add(newTask, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.lastId){
                console.log('Task #' + result.lastId + ' added to list ' + major.blue);
            }
            else{
                console.log('Database did not return.'.red); // TODO change this
            }
        });
    }
};

Command.prototype.done = function(major, minor){
    this.task.setDone(major, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked as done.');
        }
        else{
            console.log('Task #' + major + ' does not exist.');
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
        this.task.remove(taskId, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.affected && result.affected > 0){
                console.log('Task #' + taskId + ' deleted.');
            }
            else{
                console.log('Task #' + taskId + ' does not exist.');
            }
        });
    }
};

Command.prototype.showOverview = function(){
    this.task.getToDo(function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.rows.length > 0){
            var currentList = null;
            for (var i in result.rows){
                if (currentList !== result.rows[i].listName){
                    currentList = result.rows[i].listName;
                    console.log(result.rows[i].listName + ':');
                }
                console.log('  (' + result.rows[i].id + ') ' + result.rows[i].name);
            }
        }
        else{
            console.log('Nothing to show.');
        }
    });
};

Command.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [options]');
    console.log('');
    console.log('  Available actions and options:');
    console.log('    nodo show                        Show all lists and tasks todo');
    console.log('    nodo show all                    Same as above');
    console.log('    nodo show lists                  Show all lists and number of tasks in each one.');
    console.log('    nodo show <list_name>            Show content of list');
    console.log('    nodo show done                   Show all done tasks');
    console.log('    nodo show deleted                Show all deleted tasks');
    console.log('    nodo show task <task_id>         Show detail of a task');
    console.log('');
    console.log('    nodo add list <list_name>        Add a new list');
    console.log('    nodo add <list_name> <task_name> Add a new task to list');
    console.log('');
    console.log('    nodo done <task_id>              Mark a task as done');
    console.log('');
    console.log('    nodo remove list <list_name>     Delete list');
    console.log('    nodo remove task <task_id>       Delete task');
};

Command.prototype.showVersion = function(){
    var nodoVersion = require('../lib/config').version;
    console.log('Nodo - The Awesome Command Line Todo App - Version ' + nodoVersion);
};

module.exports = Command;
