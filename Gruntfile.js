module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'lib/*.js', 'bin/*', 'test/*.js']
        },
        nodeunit: {
            all: ['test/*.js']
        },
        shell: {
            man: {
                command: 'marked-man README.md > doc/nodo.1'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['jshint', 'nodeunit']);
    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('man', ['shell']);
};
