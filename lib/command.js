/*jshint node:true, strict:false, onevar:false */
/**
 * Command Line Parser
 * Parses all the actions and options passed in the command line
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

var fs = require('fs'),
    color = require('colors'),
    List = require('../lib/list'),
    Task = require('../lib/task');

var makeCallback = function(type, id, actionMsg, callback){
    var typeMsg;

    id = id || '';
    id = id.toString().bold;

    if (type === 'task'){
        typeMsg = 'Task ' + id + ' ';
    }
    else if (type === 'list'){
        typeMsg = 'List ' + id + ' ';
    }
    else{
        throw new Error('Unknown type');
    }

    return function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (
            (result.row) ||
                (result.rows && result.rows.length > 0) ||
                result.affected > 0){
            if (actionMsg){
                console.log(typeMsg + actionMsg);
            }
            if (callback){
                callback(err, result);
            }
        }
        else if (id){
            console.log(typeMsg + 'does not exist.');
        }
        else{
            console.log('No ' + type + ' identifier specified.');
        }
    };
};

var paddLeft = function(text, count) {
    var paddingLength = count - text.length,
        padding;

    if (paddingLength < 0){
        paddingLength = 0;
    }
    padding = (new Array(paddingLength + 1)).join(' ');

    return padding + text;
};

var logResults = function(type, result, cleanTpl) {
    var i,
        doneDate,
        doneDateStr,
        tpl,
        row,
        listNameStr;

    cleanTpl = cleanTpl || '{id}  {name}';

    for (i in result.rows){
        if (Object.hasOwnProperty.call(result.rows, i)){
            row = result.rows[i];
            tpl = cleanTpl;
            doneDateStr = '';
            listNameStr = '';

            if (type === 'task'){
                if (row.done_date){
                    doneDate = new Date(row.done_date * 1000);
                    doneDateStr =
                        doneDate.getDate() + '/' +
                        (doneDate.getMonth() + 1) + '/' +
                        doneDate.getFullYear();
                    doneDateStr = paddLeft(doneDateStr, 10).grey;
                }

                if (row.listName){
                    listNameStr = paddLeft(row.listName, 20).bold;
                }

                tpl = tpl.replace('{id}', paddLeft(row.id.toString(), 4).grey.bold);

                tpl = tpl.replace('{listName}', listNameStr);
                tpl = tpl.replace('{doneDate}', doneDateStr);
                tpl = tpl.replace('{name}', row.name);
                if (row.important){
                    tpl = tpl + ' ★'.red;
                }
            }
            else{
                tpl = tpl.replace('{name}', row.name.bold);
                tpl = tpl.replace('{totalTasks}', row.totalTasks);
            }

            console.log(tpl);
        }
    }
};

var logResultsFull = function(type, result) {
    logResults(type, result, '{id}  {listName} {doneDate} {name}');
};

var Command = function(){
    this.list = new List();
    this.task = new Task();
};

Command.prototype.run = function(args){
    args.splice(0, 2); // removing interpreter and file name

    var command = args.shift(),
        major = args.shift(),
        minor = args.shift(),
        extra = args;

    if (typeof command === 'undefined' || !command || command === '-h' ||
            command === '--help' || command === 'help'){
        this.showHelp();
        process.exit(0);
    }
    else if (command === '-v' || command === '--version' || command === 'version'){
        this.showVersion();
        process.exit(0);
    }
    else {
        this.delegate(command, major, minor, extra);
    }
};

Command.prototype.delegate = function(command, major, minor, extra){
    var type = (major === 'list') ? 'list' : 'task',
        id = (type === 'list') ? minor : major,
        args = [type, id, major, minor, extra],
        commands = [
            'ls',
            'show',
            'add',
            'done',
            'undo',
            'star',
            'unstar',
            'rm',
            'restore',
            'move'
        ];

    if (!isNaN(command)){
        id = command;
        command = 'show';
        args = [type, id, major, minor, extra];
    }

    if (commands.indexOf(command) !== -1){
        this[command].apply(this, args);
    }
    else{
        return this.showHelp();
    }
};

Command.prototype.show = function(type, id){
    var padding = 25,
        log = function(name, value){
            console.log((paddLeft(name, padding) + ': ').grey + value);
        };

    this.task.get(id, makeCallback('task', id, undefined, function(err, result){
        log('Task', result.row.id);
        log('List', result.row.listName);
        log('Name', result.row.name);
        log('Important', (result.row.important ? 'yes' : 'no'));
        log('Notes', (result.row.notes ? result.row.notes : 'none'));
        log('Due Date', (result.row.date ? Date(result.row.date) : 'none'));
        log('Done', (result.row.done ? 'yes' : 'no'));
        log('Done Date', (result.row.done_date ? Date(result.row.done_date) : 'none'));
        log('Removed', (result.row.deleted ? 'yes' : 'no'));
    }));
};

Command.prototype.ls = function(type, id, major, minor, extra){
    if (!major && !minor){
        this.showOverview();
    }
    else if (major === 'lists'){
        this.list.getAll(function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else{
                logResults('list', result, '{name} ({totalTasks})');
            }
        });
    }
    else if (major === 'done'){
        this.task.getDone(minor, function(err, result){
            var i;

            if (err){
                console.log(err.toString().red);
            }
            else if (result.rows.length < 1){
                console.log('No tasks are done yet. Are you slacking?'.yellow);
            }
            else{
                logResultsFull('task', result);
            }
        });
    }
    else if (major === 'removed'){
        this.task.getDeleted(minor, function(err, result){
            var i;

            if (err){
                console.log(err.toString().red);
            }
            else if (!result.rows || result.rows.length < 1){
                console.log('There are no removed tasks.'.yellow);
            }
            else{
                logResults('task', result, '{id}  {name}');
            }
        });
    }
    else if (major){
        // lets assume its a list name
        this.list.getByName(id, makeCallback('list', id, undefined, function(err, result){
            logResults('task', result);
        }));
    }
    else{
        // alias for show all
        this.showOverview();
    }
};

Command.prototype.add = function(type, id, list_id, task_name){
    if (type === 'list'){
        if (id){
            this.list.add(id, function(err, result){
                if (err){
                    console.log(err.toString().red);
                }
                else if (result.lastId){
                    console.log('Added list ' + (id.toString().bold));
                }
                else{
                    console.log('Database did not return.'.red); // TODO change this
                }
            });
        }
        else{
            console.log('List name cannot be empty.'.yellow);
        }
    }
    else{
        var newTask = {
            list: list_id,
            name: task_name
        };
        this.task.add(newTask, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.lastId){
                console.log('Task ' + (result.lastId.toString().bold) + ' added to list ' + list_id.bold);
            }
            else{
                console.log('Database did not return.'.red); // TODO change this
            }
        });
    }
};

Command.prototype.done = function(type, id){
    this.task.setDone(id, 1, makeCallback('task', id, 'marked as done'));
};

Command.prototype.undo = function(type, id){
    this.task.setDone(id, 0, makeCallback('task', id, 'marked as not done'));
};

Command.prototype.star = function(type, id){
    this.task.setStar(id, 1, makeCallback('task', id, 'marked as important'));
};

Command.prototype.unstar = function(type, id){
    this.task.setStar(id, 0, makeCallback('task', id, 'marked as not important'));
};

Command.prototype.remove = function(type, id){
    this[type].remove(id, makeCallback(type, id, 'removed'));
};

Command.prototype.restore = function(type, id){
    this[type].remove(id, makeCallback(type, id, 'restored'));
};

Command.prototype.move = function(type, id, task_id, list_id){
    this.task.move(task_id, list_id, makeCallback('task', task_id, 'moved to list ' + list_id));

};

Command.prototype.showOverview = function(){
    this.task.getToDo(function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.rows.length > 0){
            logResultsFull('task', result);
        }
        else{
            console.log('Nothing to show.');
        }
    });
};

Command.prototype.showHelp = function(){
    var log = console.log;

    log('');
    log('Usage: nodo <action> [arguments]');
    log('');
    log('nodo ls                          Show all lists and tasks todo');
    log('nodo ls lists                    Show all lists and number of tasks in each one.');
    log('nodo ls done                     Show all done tasks');
    log('nodo ls done <n>                 Show the last n done tasks');
    log('nodo ls rm                       Show all removed tasks');
    log('nodo ls <list_name>              Show tasks of list');
    // log('nodo ls <list_name> done         Show done tasks of list');
    // log('nodo ls <list_name> done <n>     Show last n done tasks of list');
    // log('nodo ls <list_name> rm          Show removed tasks of list');
    log('');
    log('nodo <task_id>                   Show details of a task');
    log('');
    // log('nodo add <task_id>               Add a new task to default list');
    log('nodo add <list_name> <task_id>   Add a new task to list');
    log('nodo add list <list_name>        Add a new list');
    log('');
    log('nodo done <task_id>              Mark a task as done');
    log('nodo undo <task_id>              Mark a task as not done');
    log('');
    log('nodo star <task_id>              Star a task (will display with different color)');
    log('nodo unstar <task_id>            Unstar a task');
    log('');
    log('nodo rm <task_id>                Remove task');
    log('nodo rm list <list_name>         Remove list');
    log('');
    log('nodo restore <task_id>           Restore task');
    log('nodo restore list <list_name>    Restore list');
    log('');
    log('nodo move <task_id> <list_name>  Moves a task to a list');
};

Command.prototype.showVersion = function(){
    var log = console.log,
        nodoVersion = require('../lib/config').version;

    log('');
    log("d8b   db  .d88b.  d8888b.  .d88b.");
    log("888o  88 .8P  Y8. 88  `8D .8P  Y8.");
    log("88V8o 88 88    88 88   88 88    88");
    log("88 V8o88 88    88 88   88 88    88");
    log("88  V888 `8b  d8' 88  .8D `8b  d8");
    log("VP   V8P  `Y88P'  Y8888D'  `Y88P\n");
    log('The Simple Command Line Task Manager');
    log('\nVersion '.magenta + nodoVersion.green);
    log('');
};

module.exports = Command;
