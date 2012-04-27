/**
 * Represents a list of tasks
 */

var List = function(name){
    this.name = name;
    this[name] = [];
};

List.prototype.add = function(task){
    this[this.name].push(task);
};

List.prototype.getTotal = function(){
    return this[this.name].length;
};

module.exports = List;
