var
	gulp = require('gulp'),
	through2 = require('gulp-util/node_modules/through2'),
	lintspaces = require('../')
;

module.exports = function(paths, options, callback) {
	var invalid = {};
	gulp.src(paths)
		.pipe(lintspaces(options))
		.pipe(through2.obj(function(file, enc, callback) {
			if(file.lintspaces) {
				invalid[file.path] = file.lintspaces;
			}

			callback();
		}))
		.on('finish', function() {
			callback(invalid);
		})
};
