var
	es          = require('event-stream'),
	Lintspaces  = require('lintspaces'),
	gutil       = require('gulp-util'),
	PluginError = require('gulp-util').PluginError,
	colors      = require('gulp-util').colors,
	util        = require('util')
;

module.exports = function(options) {
	var lintspaces = new Lintspaces(options || {});

	return es.through(function(file) {
		if (file.isNull()) {
			return this.emit('data', file);
		}

		lintspaces.validate(file.path);
		file.lintspaces = lintspaces.getInvalidLines(file.path);

		// HACK: Clean-up the cache for re-validation
		delete lintspaces._invalid[file.path];

		return this.emit('data', file);
	});
};

module.exports.reporter = function() {
	return es.through(function(file) {
		if (file.isNull()) {
			return this.emit('data', file);
		}

		if (file.lintspaces && Object.keys(file.lintspaces).length) {
			for (var line in file.lintspaces) {
				file.lintspaces[line].forEach(function(error) {
					gutil.log(util.format(
						'[%s] %s (%s:%d)',
						colors.cyan('gulp-lintspaces'),
						colors.red(error.message),
						colors.magenta(file.path),
						line
					));
				});
			}
		}

		if (Object.keys(file.lintspaces).length) {
			this.emit('error', new PluginError("lintspaces", "Failed linting spaces"));
		}

		return this.emit('data', file);
	});
}
