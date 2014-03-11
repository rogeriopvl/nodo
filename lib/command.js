/**
* Command Line Parser
* Parses all the actions and options passed in the command line
*
* @author Rogério Vicente <rogeriopvl@gmail.com>
* @license MIT (see LICENSE file)
*/

var fs = require('fs'),
    color = require('colors'),
    Insight = require('insight'),
    List = require('../lib/list'),
    Task = require('../lib/task'),
    pkg = require('../package.json');

var Command = function(){
    this.insight = new Insight({
        trackingCode: 'UA-43711392-1',
        packageName: pkg.name,
        packageVersion: pkg.version
    });

    this.list = new List();
    this.task = new Task();
};

Command.prototype.run = function(args){

    if (this.insight.optOut === undefined){
        this.insight.track('downloaded');
        return this.insight.askPermission();
    }

    args.splice(0, 2); // removing interpreter and file name

    var command = args.shift();
    var major = args.shift();
    var minor = args.length < 1 ? null : args.join(' ');

    if (typeof command === 'undefined' || !command || command === '-h' ||
        command === '--help' || command === 'help'){
        this.insight.track('help');
        this.showHelp();
        process.exit(0);
    }
    else if (command === '-v' || command === '--version' || command === 'version'){
        this.insight.track('version');
        this.showVersion();
        process.exit(0);
    }
    else {
        this.delegate(command, major, minor);
    }
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
        case 'undo':
            this.undo(major, minor);
            break;
        case 'star':
            this.star(major, minor);
            break;
        case 'unstar':
            this.unstar(major, minor);
            break;
        case 'due':
            this.due(major, minor);
            break;
        case 'move':
            this.move(major, minor);
            break;
        case 'restore':
            this.restore(major, minor);
            break;
        default:
            return this.showHelp();
    }
};

Command.prototype.show = function(major, minor){
    var self = this;
    if (major === 'lists'){
        this.insight.track('show', major);
        this.list.getAll(function(err, result){
            var i;

            if (err){
                console.log(err.toString().red);
            }
            else{
                for (i in result.rows){
                    if (Object.hasOwnProperty.call(result.rows, i)){
                        console.log(result.rows[i].name + ' (' + result.rows[i].totalTasks  + ')');
                    }
                }
            }
        });
}
    else if (major === 'done'){
        this.insight.track('show', major);
        this.task.getDone(minor, function(err, result){
            var i;

            if (err){
                console.log(err.toString().red);
            }
            else if (result.rows.length < 1){
                console.log('No tasks are done yet. Are you slacking?'.yellow);
            }
            else{
                for (i in result.rows){
                    if (Object.hasOwnProperty.call(result.rows, i)){
                        var doneString = '(' + result.rows[i].id + ') ' + result.rows[i].name + ' | ';
                        doneString += result.rows[i].listName.bold + ' | ';
                        doneString += self.parseDate(result.rows[i].done_date);
                        console.log(doneString);
                    }
                }
            }
        });
    }
    else if (major === 'all'){
        this.insight.track('show', major);
        this.showOverview();
    }
    else if (major === 'task'){
        this.insight.track('show', major);
        this.task.get(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (!result.row){
                console.log('Task #' + minor + ' does not exist.');
            }
            else{
                var dueDate = result.row.date ? new Date(result.row.date*1000) : 'none';
                console.log('Task #' + result.row.id);
                console.log('List: ' + result.row.listName);
                console.log('Name: ' + result.row.name);
                console.log('Important: ' + (result.row.important ? 'yes' : 'no'));
                console.log('Notes: ' + (result.row.notes ? result.row.notes : 'none'));
                console.log('Due Date: ' + (result.row.date ? self.parseDate(result.row.date) : 'none'));
                console.log('Done: ' + (result.row.done ? 'yes' : 'no'));
                console.log('Done Date: ' + (result.row.done_date ? self.parseDate(result.row.done_date) : 'none'));
                console.log('Deleted: ' + (result.row.deleted ? 'yes' : 'no'));
            }
        });
    }
    else if (major === 'deleted'){
        this.insight.track('show', major);
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
        this.list.getByName(major, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.rows.length < 1){
                console.log('This list is empty or does not exist.'.yellow);
            }
            else{
                for (var j in result.rows){
                    console.log("(" + result.rows[j].id + ') ' + result.rows[j].name);
                }
            }
        });
    }
    else{
        this.insight.track('overview');
        // alias for show all
        this.showOverview();
    }
};

Command.prototype.add = function(major, minor){
    if (major === 'list'){
        this.insight.track('add', major);
        if (minor){
            this.list.add(minor, function(err, result){
                if (err){
                    console.log(err.toString().red);
                }
                else if (result.lastId){
                    console.log('Added list ' + minor);
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
        this.insight.track('add', major);
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
    this.insight.track('done');
    this.task.setDone(major, 1, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked as done.');
        }
        else{
            if (major){
                console.log('Task #' + major + ' does not exist.');
            }
            else{
                console.log('No task specified.');
            }
        }
    });
};

Command.prototype.undo = function(major, minor){
    this.insight.track('undo');
    this.task.setDone(major, 0, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked as not done.');
        }
        else{
            if (major){
                console.log('Task #' + major + ' does not exist.');
            }
            else{
                console.log('No task specified.');
            }
        }
    });
};

Command.prototype.star = function(major, minor){
    this.insight.track('star');
    this.task.setStar(major, 1, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked as important.');
        }
        else{
            if (major){
                console.log('Task #' + major + ' does not exist.');
            }
            else{
                console.log('No task specified.');
            }
        }
    });
};

Command.prototype.unstar = function(major, minor){
    this.insight.track('unstar');
    this.task.setStar(major, 0, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked as not important.');
        }
        else{
            if (major){
                console.log('Task #' + major + ' does not exist.');
            }
            else{
                console.log('No task specified.');
            }
        }
    });
};

Command.prototype.due = function(major, minor){
    this.insight.track('due');
    var dueDate = Date.parse(minor)/1000;
    this.task.setDue(major, dueDate, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.affected && result.affected > 0){
            console.log('Task #' + major + ' marked to be finished at ' + minor);
        }
        else{
            if (major){
                console.log('Task #' + major + ' does not exist.');
            }
            else{
                console.log('No task specified.');
            }
        }
    });
};

Command.prototype.remove = function(major, minor){
    if (major === 'list'){
        this.insight.track('remove', major);
        this.list.remove(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.affected && result.affected > 0){
                console.log('List ' + minor + ' deleted.');
            }
            else{
                console.log('List ' + minor + ' does not exist.');
            }
        });
    }
    else{
        this.insight.track('remove', 'task');
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

Command.prototype.restore = function(major, minor){
    if (major === 'list'){
        this.insight.track('restore', major);
        this.list.restore(minor, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.affected && result.affected > 0){
                console.log('List ' + minor + ' restored.');
            }
            else{
                console.log('List ' + minor + ' does not exist.');
            }
        });
    }
    else{
        this.insight.track('restore', 'task');
        // allow alias for restore task #
        var taskId = major === 'task' ? minor : major;
        this.task.restore(taskId, function(err, result){
            if (err){
                console.log(err.toString().red);
            }
            else if (result.affected && result.affected > 0){
                console.log('Task #' + taskId + ' restored.');
            }
            else{
                console.log('Task #' + taskId + ' does not exist.');
            }
        });
    }
};

Command.prototype.move = function(major, minor){
    this.insight.track('move');
    this.task.move(major, minor, function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if(result.affected > 0){
            console.log('Task #' + major + ' moved to list ' + minor);
        }
        else{
            console.log('Task or list unknown.'.red);
        }
    });
};

Command.prototype.showOverview = function(){
    this.insight.track('overview');
    this.task.getToDo(function(err, result){
        if (err){
            console.log(err.toString().red);
        }
        else if (result.rows.length > 0){
            var i,
                currentList = null;

            for (i in result.rows){
                if (Object.hasOwnProperty.call(result.rows, i)){
                    if (currentList !== result.rows[i].listName){
                        currentList = result.rows[i].listName;
                        console.log(result.rows[i].listName.bold.underline + ':'.bold.underline);
                    }
                }
                var taskStr = '(' + result.rows[i].id + ') ' + result.rows[i].name;
                if (result.rows[i].important === 1){
                    console.log(taskStr.yellow + ' ★'.yellow);
                }
                else{
                    console.log(taskStr);
                }
            }
        }
        else{
            console.log('Nothing to show.');
        }
    });
};

/**
 * Transforms a unix timestamp (seconds) to a date string
 * @param {Integer} timestamp
 * @return {String} the timestamp converted to a date string
 */
Command.prototype.parseDate = function(timestamp){
    var dateObj = new Date(timestamp*1000);
    var dateStr = dateObj.getDate() + '/' + (dateObj.getMonth()+1);
    dateStr+= '/' + dateObj.getFullYear();
    return dateStr;
};

Command.prototype.showHelp = function(){
    console.log('Usage: nodo <action> [arguments]');
    console.log('');
    console.log('  Available actions and options:');
    console.log('    nodo show                        Show all lists and tasks todo');
    console.log('    nodo show all                    Same as above');
    console.log('    nodo show lists                  Show all lists and number of tasks in each one.');
    console.log('    nodo show <list_name>            Show content of list');
    console.log('    nodo show done                   Show all done tasks');
    console.log('    nodo show done <n>               Show the last n done tasks');
    console.log('    nodo show deleted                Show all deleted tasks');
    console.log('    nodo show task <task_id>         Show detail of a task');
    console.log('');
    console.log('    nodo add list <list_name>        Add a new list');
    console.log('    nodo add <list_name> <task_name> Add a new task to list');
    console.log('');
    console.log('    nodo done <task_id>              Mark a task as done');
    console.log('    nodo undo <task_id>              Mark a task as not done');
    console.log('');
    console.log('    nodo star <task_id>              Star a task (will display with different color)');
    console.log('    nodo unstar <task_id>            Unstar a task');
    console.log('');
    console.log('    nodo move <task_id> <list_name>  Moves a task to a list');
    console.log('');
    console.log('    nodo delete list <list_name>     Delete list');
    console.log('    nodo delete task <task_id>       Delete task');
    console.log('');
    console.log('    nodo restore <task_id>           Restore task');
    console.log('    nodo restore task <task_id>      Restore task');
    console.log('    nodo restore list <list_name>    Restore list');
};

Command.prototype.showVersion = function(){
    console.log('');
    console.log("d8b   db  .d88b.  d8888b.  .d88b.");
    console.log("888o  88 .8P  Y8. 88  `8D .8P  Y8.");
    console.log("88V8o 88 88    88 88   88 88    88");
    console.log("88 V8o88 88    88 88   88 88    88");
    console.log("88  V888 `8b  d8' 88  .8D `8b  d8");
    console.log("VP   V8P  `Y88P'  Y8888D'  `Y88P\n");
    console.log('The Simple Command Line Task Manager');
    console.log('\nVersion '.magenta + pkg.version.green);
    console.log('');
};

module.exports = Command;
