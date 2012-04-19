var cmdParser = require('commander');

function test(val){
    console.log(test.arguments);
    console.log('Adding task: '+val);
}

cmdParser
    .version('0.0.1')
    .option('add <item> [label]', 'Add a task to the list', test)
    .option('done <i>', 'Complete a task with number i', test)
    .option('delete <i>', 'Delete task with number i', test)
    .parse(process.argv);
