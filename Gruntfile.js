module.exports = function(grunt) {
	'use strict';

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		jsSource: 'js/src/*.js',
		cssSource: 'css/styl/*.styl',

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
					'css/app.css': 'css/styl/app.styl'
				}
			}
		},

		jshint: {
			options: {
				globals: {
					jQuery: true
				}
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
					'js/app.min.js': '<%= jsSource %>'
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
					'js/app.min.js'
				],
				dest: 'js/build.js'
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