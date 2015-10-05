var
	util = require('util'),
	gulp = require('gulp'),
	colors = require('gulp-util').colors,
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	map = require('map-stream'),
	jshintErrors = []
;

gulp.task('lint', function() {
	return gulp
		.src([
			__filename,
			'./index.js',
			'./test/**/test_*.js'
		])
		.pipe(jshint())
		.pipe(map(function (file, cb) {
			if (file.jshint && !file.jshint.success) {
				jshintErrors.push.apply(jshintErrors, file.jshint.results);
			}

			cb(null, file);
		}))
		.pipe(jscs(__dirname + '/.jscs.json'));
});

gulp.task('readme-clean', function() {
	gulp
		.src([
			'./README.md'
		], {read: false})
		.pipe(clean());
});

gulp.task('readme', ['readme-clean'], function() {
	gulp
		.src([
			'./docs/intro.md',
			'./docs/installation.md',
			'./docs/usage.md',
			'./node_modules/lintspaces/docs/options.md',
			'./docs/contribution.md',
			'./docs/license.md'
		])
		.pipe(concat('README.md'))
		.pipe(gulp.dest('.'));
});

gulp.task('default', ['lint'], function() {
	if (jshintErrors.length) {
		console.error(jshintErrors.map(function(error) {
			return util.format(
				'[%s] %s in (%s:%d)\n',
				colors.green('gulp-jshint'),
				colors.red(error.error.reason),
				error.file,
				error.error.line
			);
		}).join(''));
		process.exit(1);
	}
});
