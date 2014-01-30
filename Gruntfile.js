module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      production: {
        src: 'javascript/main.js',
        dest: 'javascript/main.min.js'
      }
    },

    sass: {
      development: {
        options: {
          style: 'expanded',
          sourcemap: true
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: './css',
          ext: '.css'
        }]
      },
      production: {
        options: {
          style: 'expanded',
          sourcemap: false
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: './css',
          ext: '.css'
        }]
      }
    },

    watch: {
      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass:development'],
        options: {
          spawn: false,
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['sass', 'watch']);

};