/**
 * Represents a task
 */

var Task = function(title){
    this.title = title;
    this.done = false;
    this.date = Date.now();
};

module.exports = Task;
