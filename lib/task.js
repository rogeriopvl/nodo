/**
 * Represents a task
 */

var Task = function(title){
    this.title = title;
    this.createAt = Date.now();
    this.done = false;
    this.doneAt = null;
};

module.exports = Task;
