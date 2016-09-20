module.exports = function(grunt) {

  grunt.initConfig({

    // Build

    clean: {
      build: {
        files: [{
          src: ['dist/*'],
          dot: true
        }]
      },
      // Used to clean out stylesheets that are now in <style>
      inlinedcss: ['dist/css/small.css', 'dist/css/normalize.css'],
      concatenatedjs: ['dist/js/app.js', 'dist/js/collections/', 'dist/js/models/', 'dist/js/views/']
    },

    htmlmin: {
      main: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.html'],
          dest: 'dist/'
        }]
      }
    },

    cssmin: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css'],
          dest: 'dist/css/'
        }]
      }
    },

    concat: {
      dist: {
        src: ['src/js/models/place.js',
              'src/js/collections/places.js',
              'src/js/views/filter-item-view.js',
              'src/js/views/filter-menu-view.js',
              'src/js/views/map-view.js',
              'src/js/views/app-view.js',
              'src/js/app.js'],
        dest: 'dist/js/app-concat.js'
      }

    },

    replace: {
      dist: {
        options: {
          patterns: [{
            match: /<link rel=\"stylesheet\" href=\"css\/small.css" media=\"screen and \(max-width:800px\)\">/g,
            replacement: '<style>/*! small.css */@media screen and (max-width: 800px) {' +
                         '<%= grunt.file.read("dist/css/small.css") %>' +
                         '}</style>'
          },{
            match: /<link rel=\"stylesheet\" href=\"css\/normalize.css\">/g,
            replacement: '<style>' +
                         '<%= grunt.file.read("dist/css/normalize.css") %>' +
                         '</style>'
          },{
            match: /js\/lib\/jquery-(\d+\.\d+\.\d+).min.js/g,
            replacement: '//code.jquery.com/jquery-$1.min.js'
          },{
            match: /js\/lib\/underscore-(\d+\.\d+\.\d+).min.js/g,
            replacement: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/$1/underscore-min.js'
          },{
            match: /js\/lib\/backbone-(\d+\.\d+\.\d+).min.js/g,
            replacement: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/$1/backbone-min.js'
          },{
            match: /<script src=\"js\/models\/place.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/collections\/places.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/views\/filter-item-view.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/views\/filter-menu-view.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/views\/map-view.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/views\/app-view.js\"><\/script>/g,
            replacement: ''
          },{
            match: /<script src=\"js\/app.js\"><\/script>/g,
            replacement: '<script src="js/app-concat.js"></script>'
          }]
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['index.html'],
          dest: 'dist/'
        }]
      }
    },

    imagemin: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'dist/images/'
        }]
      }
    },

    uglify: {
      options: {
        mangle: false,
        wrap: false,
        compress: {
          negate_iife: false,
          drop_console: true
        }
      },
      main: {
        files: [{
          expand: true,
          cwd: 'dist/js',
          src: ['**/*.js', '!lib/**'],
          dest: 'dist/js/'
        }]
      }
    },

    copy: {
      hidden: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.htaccess'],
          dest: 'dist/',
          dot: true
        }]
      }
    },


    // Testing

    jshint: {
      main: ['src/js/**/*.js', '!src/js/lib/**']
    },

    pagespeed: {
      options: {
        nokey: true,
        url: "https://kevinfrutiger.github.io/fend-neighborhood-map-backbone/",
        locale: "en_US",
        threshold: 90
      },
      desktop: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-pagespeed');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('build', ['jshint', 'clean:build', 'htmlmin', 'cssmin', 'imagemin', 'copy', 'concat', 'replace', 'clean:inlinedcss', 'uglify', 'clean:concatenatedjs']);

};