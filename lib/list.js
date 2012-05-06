/**
 * List model
 */

var sqlite = require('sqlite3').verbose();

var List = function(){
    this.db = new sqlite.Database('wunderlist.db');
};

/**
 * Get all lists that are not deleted along with the number of not done tasks
 * for each one
 * @param {Function} callback
 * @api public
 */
List.prototype.getAll = function(callback){
    var query = 'SELECT COUNT(*) AS totalTasks, lists.* FROM tasks, lists WHERE ';
    query += 'tasks.done=0 AND tasks.deleted=0 AND lists.deleted=0 AND ';
    query += 'lists.id=tasks.list_id GROUP BY tasks.list_id';
    this.db.all(query, function(err, rows){
        if (err){ return err; }
        return callback(rows);
    });
};

/**
 * Get all deleted lists
 * @param {Function} callback
 * @api public
 */
List.prototype.getDeleted = function(callback){
    var query = 'SELECT * FROM lists WHERE deleted=1';
    this.db.all(query, function(err, rows){
        if (err){ return err; }
        return callback(rows);
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
    this.db.get(query, listId, function(err, row){
        if (err){ return err; }
        return callback(row);
    });
};

/**
 * Get list tasks by given its name
 * @param {String} name the name of the list to retrieve
 * @param {Function} callback
 * @api public
 */
List.prototype.getByName = function(listName, callback){
    var query = 'SELECT tasks.id, tasks.name FROM tasks, lists WHERE lists.name=? ';
    query += 'AND lists.deleted=0 AND tasks.done=0 AND lists.id=tasks.list_id';
    this.db.all(query, listName, function(err, rows){
        if (err){ return err; }
        return callback(rows);
    });
};

module.exports = List;
