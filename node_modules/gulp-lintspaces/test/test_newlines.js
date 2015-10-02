var
	path = require('path'),
	run = require('./run')
;

require('should');

describe('newlines', function() {
	var
		base = path.join(__dirname, '..', 'node_modules', 'lintspaces', 'test', 'fixtures', 'newlines'),
		options = {
			newline: true,
			newlineMaximum: 3
		}
	;

	it('fixtures/newlines/valid.txt should have no errors', function() {
		var p = path.join(base, '/valid.txt');

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid[p].should.be.empty;
		});
	});

	it('fixtures/newlines/missing.txt should have errors', function() {
		var p = path.join(base, '/missing.txt');

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['10']);
		});
	});

	it('fixtures/newlines/toomuch.txt should have errors', function() {
		var p = path.join(base, '/toomuch.txt');

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['8', '17', '31']);
		});
	});
});
