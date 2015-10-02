
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({

    // Lints all .js files under src/ using jshint-summary as the reporter
    jshint: {
      options: {
        reporter: require('jshint-summary'),
        jshintrc: '.jshintrc',
        statistics: true,
        fileCol: 'yellow,bold'
      },
      target: [
        'app/*.js'
      ]
    }

  });

  grunt.registerTask('default', ['jshint']);

};
