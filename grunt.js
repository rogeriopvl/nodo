module.exports = function(grunt){
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'lib/*', 'test/*.js', 'bin/*']
        },
        test: {
            files: ['test/*.js']
        }
    });

    grunt.registerTask('default', 'lint test');

    grunt.registerTask('example', 'just a custom example task', function(){
        // insert task code here
    });
};
