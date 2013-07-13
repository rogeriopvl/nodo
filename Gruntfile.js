module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'lib/*.js', 'bin/*', 'test/*.js']
        },
        nodeunit: {
            all: ['test/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('default', ['jshint', 'nodeunit']);
    grunt.registerTask('test', ['nodeunit']);
};
