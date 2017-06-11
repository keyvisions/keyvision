module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'js/keyboard.min.js': 'js/keyboard.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('uglify-es');

  grunt.registerTask('default', ['uglify']);
};
