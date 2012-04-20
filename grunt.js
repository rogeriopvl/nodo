module.exports = function(grunt){
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'lib/*', 'test/*']
        },
        test: {
            files: ['test/*.js']
        }
    });

    grunt.registerTask('default', 'lint test');
};
