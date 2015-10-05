var
	gutil 			= require('gulp-util'),
	path 			= require('path'),
	lintspaces		= require('../index'),
	options = {
		newline: true,
		indentation: 'tabs',
		trailingspaces: true,
		ignores: [
			'js-comments'
		]
	}
;

require('should');

describe('main', function() {
	it('the plugin should be valid ;-)', function(done) {
		var
			file = new gutil.File({
				contents: new Buffer(''),
				path: path.join(__dirname, '..', 'index.js')
			}),
			stream = lintspaces(options),
			doneCalled = false
		;

		stream.on('end', function() {
			if (!doneCalled) {
				doneCalled = true;
				done();
			}
		});

		stream.on('error', function(error) {
			if (!doneCalled) {
				doneCalled = true;
				done(error);
			}
		});

		stream.write(file);

		stream.end();
	});
});
