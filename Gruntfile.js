module.exports = function(grunt) {
	'use strict';

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		jsSource: 'static/js/src/*.js',
		cssSource: 'static/css/**/*.styl',

		banner: 
			'/**\n' +
			' * mrm.showcase -- Mail.Ru Maps traffic showcase\n' +
			' * @author Alexander Burtsev, http://burtsev.me, <%= grunt.template.today("yyyy") %>\n' +
			' * @license MIT\n' +
			' */\n',

		stylus: {
			options: {
				banner: '<%= banner %>'
			},
			app: {
				files: {
					'static/css/app.css': 'static/css/app.styl'
				}
			}
		},

		jshint: {
			options: {
				globals: {
					jQuery: true
				},
				loopfunc: true
			},
			app: ['<%= jsSource %>'],
		},

		jscs: {
			options: {
				config: '.jscs.json'
			},
			app: ['<%= jsSource %>']
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			app: {
				files: {
					'static/js/app.min.js': '<%= jsSource %>'
				}
			}
		},

		concat: {
			options: {
				separator: '\n;'
			},
			app: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'static/js/app.min.js'
				],
				dest: 'static/js/build.js'
			}
		},

		watch: {
			js: {
				files: ['<%= jsSource %>'],
				tasks: ['jshint', 'jscs', 'uglify', 'concat']
			},
			css: {
				files: ['<%= cssSource %>'],
				tasks: ['stylus']
			}
		}
	});

	grunt.registerTask('default', ['stylus', 'jshint', 'jscs', 'uglify', 'concat', 'watch']);
};