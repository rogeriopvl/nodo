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
    var query = 'SELECT * FROM tasks WHERE done=0 AND deleted=0 ';
    query += 'ORDER BY position DESC'; 
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
    var query = 'INSERT INTO tasks (name, list_id, date) values(?, ?, ?)';
    this.db.run(query, [task.name, task.listId, task.dueDate], function(err){
        if (err){ return err; }
        return callback(true);
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
