var
	path = require('path'),
	run = require('./run')
;

require('should');

describe('indentation', function() {
	var base = path.join(__dirname, '..', 'node_modules', 'lintspaces', 'test', 'fixtures', 'indentations');

	describe('tabs', function() {
		var options = {
			indentation: 'tabs'
		};

		it('fixtures/indentations/tabs_valid.txt should have no errors', function() {
			var p = path.join(base, '/tabs_valid.txt');

			run(p, options, function(invalid) {
				invalid.should.not.be.empty;
				invalid[p].should.be.emtpy;
			});
		});

		it('fixtures/indentations/tabs_invalid.txt should have no errors', function() {
			var p = path.join(base, '/tabs_invalid.txt');

			run(p, options, function(invalid) {
				invalid.should.not.be.empty;
			});
		});
	});

	describe('spaces', function() {
		var options = {
			indentation: 'spaces'
		};

		it('fixtures/indentations/spaces_valid.txt should have no errors', function() {
			var p = path.join(base, '/spaces_valid.txt');

			run(p, options, function(invalid) {
				invalid.should.not.be.empty;
				invalid[p].should.be.emtpy;
			});
		});

		it('fixtures/indentations/spaces_invalid.txt should have no errors', function() {
			var p = path.join(base, '/spaces_invalid.txt');

			run(p, options, function(invalid) {
				invalid.should.not.be.empty;
			});
		});
	});

});
