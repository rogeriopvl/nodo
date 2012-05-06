/**
 * Task model
 */

var sqlite = require('sqlite3').verbose();

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
 * Get all the done tasks
 * @param {Function} callback
 * @api public
 */
Task.prototype.getDone = function(callback){
    var query = 'SELECT * FROM tasks WHERE done=1';
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
Task.prototype.getDeleted = function(callback){
    var query = 'SELECT * FROM tasks WHERE deleted=1';
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
    var query = 'SELECT * FROM tasks WHERE id=?';
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
        var query = 'INSERT INTO tasks (name, list_id, date) values(?, ?, ?)';
        if (err){
            return callback({result: {success: false, error: "list does not exists."}});
        }
        that.db.run(query, [task.name, row.id, task.dueDate], function(err){
            var result = {};
            if (err){
                result.error = err;
                result.success = false;
            }
            else{ result.success = true; }
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
        if (err){ return err; }
        return callback(true);
    });
};

/**
 * Mark a task with the given id as done
 * @param {Integer} taskId the id of the task to mark as done
 * @api public
 */
Task.prototype.setDone = function(taskId, callback){
    var query = 'UPDATE tasks SET done=1 WHERE id=?';
    this.db.run(query, taskId, function(err){
        if (err){ return err; }
        return callback(true);
    });
};

module.exports = Task;
