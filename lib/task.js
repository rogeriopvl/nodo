/**
 * Task model
 */

var sqlite = require('sqlite3').verbose();
var config = require('../lib/config');

var Task = function(){
    this.db = new sqlite.Database('wunderlist.db');
};

/**
 * Get all the tasks
 * @param {Function} callback
 * @api public
 */
Task.prototype.getToDo = function(callback){
    var query = 'SELECT lists.name as listName, tasks.name, tasks.id FROM tasks, lists ';
    query += 'WHERE tasks.done=0 AND tasks.deleted=0 AND tasks.list_id=lists.id ';
    query += 'ORDER BY lists.id';
    this.db.all(query, function(err, rows){
        if (err){ return err; }
        return callback(rows);
    });
};

/**
 * Get all the done not deleted tasks
 * @param {Integer} limit the number of most recent done tasks
 * @param {Function} callback
 * @api public
 */
Task.prototype.getDone = function(limit, callback){
    var query = 'SELECT lists.name as listName, tasks.* FROM tasks, lists WHERE done=1 ';
    query += 'AND tasks.deleted=0 AND tasks.list_id=lists.id ORDER BY tasks.done_date DESC';
    if (limit){
        query += ' LIMIT ' + limit;
    }
    this.db.all(query, function(err, rows){
        if (err){ return err; }
        return callback(rows);
    });
};

/**
 * Get all the deleted tasks
 * @param {Function} callback
 * @api public
 */
Task.prototype.getDeleted = function(limit, callback){
    var query = 'SELECT * FROM tasks WHERE deleted=1';
    if (limit){
        query += ' LIMIT ' + limit;
    }
    this.db.all(query, function(err, rows){
        if (err){ return err; }
        return callback(rows);
    });
};

/**
 * Get a task with the given id
 * @param {Integer} taskId the id of the task to retrieve
 * @api public
 */
Task.prototype.get = function(taskId, callback){
    var query = 'SELECT lists.name as listName, tasks.* FROM tasks, lists ';
    query += 'WHERE tasks.id=? AND lists.id=tasks.list_id';
    this.db.get(query, taskId, function(err, row){
        if (err){ return err; }
        return callback(row);
    });
};

/**
 * Add a new task
 * @param {Object} task the new task to be added
 * @api public
 */
Task.prototype.add = function(task, callback){
    var that = this;
    this.db.get('SELECT id FROM lists WHERE name=?', task.list, function(err, row){
        if (err || !row){
            return callback({success: false, error: "list does not exist."});
        }
        var query = 'INSERT INTO tasks (name, list_id, date) values(?, ?, ?)';
        that.db.run(query, [task.name, row.id, task.dueDate], function(err){
            var result = {};
            if (err){
                result.error = err;
                result.success = false;
            }
            else{
                result.success = true;
                result.lastId = this.lastID;
            }
            return callback(result);
        });
        return true;
    });
};

/**
 * Marks as deleted a task with the given id
 * @param {Integer} taskId the id of the task to mark as deleted
 * @api public
 */
Task.prototype.remove = function(taskId, callback){
    var query = 'UPDATE tasks SET deleted=1 WHERE id=?';
    this.db.run(query, taskId, function(err){
        var result = {};
        if (err || this.changes === 0){
            result.error = err ? err : 'unknown task.';
            result.sucess = false;
        }
        else{ result.success=true; }
        return callback(result);
    });
};

/**
 * Mark a task with the given id as done
 * @param {Integer} taskId the id of the task to mark as done
 * @api public
 */
Task.prototype.setDone = function(taskId, callback){
    var doneDate = Date.now()/1000;
    var query = 'UPDATE tasks SET done=1, date=? WHERE id=?';
    this.db.run(query, [doneDate, taskId], function(err){
        var result = {};
        if (err || this.changes === 0){
            result.error = err ? err : 'unknown task.';
            result.success = false;
        }
        else{ result.success = true; }
        return callback(result);
    });
};

module.exports = Task;
