var
	path = require('path'),
	run = require('./run')
;

require('should');

describe('trailingspaces', function() {
	var
		base = path.join(__dirname, '..', 'node_modules', 'lintspaces', 'test', 'fixtures'),
		options = {
			trailingspaces: true
		}
	;

	it('fixtures/trailingspaces.txt should have errors', function() {
		var p = path.join(base, '/trailingspaces.txt');

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['3', '4', '5', '6', '7', '8', '9', '10']);
		});
	});
});
