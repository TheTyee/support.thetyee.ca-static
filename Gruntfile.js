module.exports = function(grunt) {
    // https://github.com/sindresorhus/load-grunt-tasks
    //require('load-grunt-tasks')(grunt);
    // 
    // TODO
    // - Think about concatenating & copying CSS & JS from bower_components
    // - Think about adding a banner to JS/CSS files while doing that
    // |-> Then the asset_bunlder would just compress and hash
    // - Use package.json properties (where sensible) in here
    //
    // - Really, I should probably limit Grunt use to purely development & testing
    // and maybe deployment (TBD)
    //
    // - The rest I should put into a Ruby-based asset pipeline (compiling, compressing, etc.)
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint'); // Local dev only
    grunt.loadNpmTasks('grunt-jsbeautifier'); // Ditto
    grunt.loadNpmTasks('grunt-contrib-uglify'); // Ditto

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Less task
        less: {
            options: {},
            development: {
                files: [{
                    expand: true,
                    cwd: 'ui/less/',
                    //src: ['**/*.less'],
                    src: ['styles.less'],
                    dest: 'ui/css/',
                    ext: '.css',
                    report: 'min'
                }]
            },
            production: {}
        },
        // JSHint task
        jshint: {
            options: {
                force: true
            },
            all: ['ui/js/widget.js', 'ui/js/recentstories.js']
        },
        jsbeautifier: {
            files: ['ui/js/widget.js', 'ui/js/recentstories.js']
        },
        uglify: {
            development: {
                files: {
                    'ui/js/widget.min.js': ['ui/js/widget.js'],
                    'ui/js/recentstories.min.js': ['ui/js/recentstories.js']
                }
            }
        }
    });
    // Default task(s).
    grunt.registerTask('default', ['deploy']);

    grunt.registerTask('deploy', function(target) {
        grunt.task.run([
            'less:development',
            'jshint',
            'jsbeautifier',
            'uglify:development'
        ]);
    });
};
