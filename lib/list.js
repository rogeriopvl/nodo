/**
 * List model
 */

var database = require('../lib/database');

var List = function(){};

/**
 * Get all lists that are not deleted along with the number of not done tasks
 * for each one
 * @param {Function} callback
 * @api public
 */
List.prototype.getAll = function(callback){
    var query = 'SELECT lists.name, COUNT(tasks.id) as totalTasks FROM lists ';
    query += 'LEFT OUTER JOIN tasks ON tasks.list_id=lists.id ';
    query += 'AND tasks.deleted=0 AND tasks.done=0 WHERE lists.deleted=0 ';
    query += 'GROUP BY lists.name';
    database.all(query, function(err, rows){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.rows = rows;
            return callback(null, result);
        }
    });
};

/**
 * Get all deleted lists
 * @param {Function} callback
 * @api public
 */
List.prototype.getDeleted = function(callback){
    var query = 'SELECT * FROM lists WHERE deleted=1';
    database.all(query, function(err, rows){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.rows = rows;
            return callback(null, result);
        }
    });
};

/**
 * Get list with the given id
 * @param {Integer} listId the id of the list to retrieve
 * @param {Function} callback
 * @api public
 */
List.prototype.get = function(listId, callback){
    var query = 'SELECT * FROM lists WHERE id=?';
    database.get(query, listId, function(err, row){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.row = row;
            return callback(null, result);
        }
    });
};

/**
 * Adds a new list
 * @param {String} listName the name of the new list
 * @param {Function} callback
 * @api public
 */
List.prototype.add = function(listName, callback){
    var query = 'INSERT INTO lists (name) values (?)';
    database.run(query, listName, function(err){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.lastId = this.lastID;
            return callback(null, result);
        }
    });
};

/**
 * Get the tasks of a list by given its name
 * @param {String} name the name of the list to retrieve
 * @param {Function} callback
 * @api public
 */
List.prototype.getByName = function(listName, callback){
    var query = 'SELECT tasks.id, tasks.name FROM tasks, lists WHERE lists.name=? ';
    query += 'AND lists.deleted=0 AND tasks.done=0 AND lists.id=tasks.list_id';
    database.all(query, listName, function(err, rows){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.rows = rows;
            return callback(null, result);
        }
    });
};

/**
 * Removes list with given name
 * @param {String} listName the name of the list to remove
 * @param {Function} callback
 * @api public
 */
List.prototype.remove = function(listName, callback){
    var query = 'UPDATE lists SET deleted=1 WHERE name=?';
    database.run(query, listName, function(err, rows){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.affected = this.changes;
            return callback(null, result);
        }
    });
};

/**
 * Restores a deleted list
 * @param {String} listName the name of the list to restore
 * @param {Function} callback
 * @api public
 */
List.prototype.restore = function(listName, callback){
    var query = 'UPDATE lists SET deleted=0 WHERE name=?';
    database.run(query, listName, function(err, rows){
        if (err){
            return callback(err);
        }
        else{
            var result = {};
            result.rows = rows;
            return callback(null, result);
        }
    });
};

module.exports = List;
