var
	path = require('path'),
	run = require('./run')
;

require('should');

describe('comments', function() {
	var base = path.join(__dirname, '..', 'node_modules', 'lintspaces', 'test', 'fixtures', 'comments');

	it('fixtures/comments/javascript.js should have expected errors', function() {
		var
			options = {
				indentation: 'tabs',
				ignores: ['js-comments']
			},
			p = path.join(base, 'javascript.js')
		;

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid.should.have.property(p);
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['32', '46', '54']);
		});
	});

	it('fixtures/comments/python.py should have expected errors', function() {
		var
			options = {
				indentation: 'spaces',
				ignores: ['python-comments']
			},
			p = path.join(base, 'python.py')
		;

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid.should.have.property(p);
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['12']);
		});
	});

	it('fixtures/comments/xml.xml should have expected errors', function() {
		var
			options = {
				indentation: 'tabs',
				ignores: ['xml-comments']
			},
			p = path.join(base, 'xml.xml')
		;

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid.should.have.property(p);
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['14', '17', '19']);
		});
	});

	it('fixtures/comments/custom.txt should have expected errors', function() {
		var
			options = {
				indentation: 'spaces',
				ignores: [
					/<comment>[\s\S]*?<\/comment>/g
				]
			},
			p = path.join(base, 'custom.txt')
		;

		run(p, options, function(invalid) {
			invalid.should.not.be.empty;
			invalid.should.have.property(p);
			invalid[p].should.not.be.empty;
			Object.keys(invalid[p]).should.be.eql(['2', '4']);
		});
	});

});
