module.exports = function(grunt) {
	'use strict';

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		jsSource: [
			'static/js/src/utils.js',
			'static/js/src/app.js',
			'static/js/src/map.js',
			'static/js/src/spinner.js'
		],
		cssSource: 'static/css/**/*.styl',

		banner: 
			'/**\n' +
			' * mrm.showcase -- Mail.Ru Maps traffic showcase\n' +
			' * @author Alexander Burtsev, http://burtsev.me, <%= grunt.template.today("yyyy") %>\n' +
			' * @license MIT\n' +
			' */\n',

		stylus: {
			options: {
				banner: '<%= banner %>',
				compress: false
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
			app: ['<%= concat.app.dest %>']
		},

		jscs: {
			options: {
				config: '.jscs.json'
			},
			app: ['<%= concat.app.dest %>']
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			app: {
				files: {
					'static/js/build/app.min.js': [
						'bower_components/spin.js/spin.js',
						'static/js/build/app.js'
					]
				}
			}
		},

		concat: {
			options: {
				separator: '\n;'
			},
			app: {
				options: {
					banner: 'jQuery(function($) {\n\t\'use strict\';\n\n',
					footer: '\n});',
					separator: '\n\n'
				},
				src: ['<%= jsSource %>'],
				dest: 'static/js/build/app.js'
			},
			build: {
				src: [
					'bower_components/lodash/dist/lodash.min.js',
					'bower_components/jquery/dist/jquery.min.js',
					'static/js/build/app.min.js'
				],
				dest: 'static/js/build/build.js'
			}
		},

		watch: {
			js: {
				files: ['<%= jsSource %>'],
				tasks: ['concat:app', 'jshint', 'jscs', 'uglify', 'concat:build']
			},
			css: {
				files: ['<%= cssSource %>'],
				tasks: ['stylus']
			}
		}
	});

	grunt.registerTask('default', [
		'stylus',
		'concat:app',
		'jshint',
		'jscs',
		'uglify',
		'concat:build',
		'watch'
	]);
};