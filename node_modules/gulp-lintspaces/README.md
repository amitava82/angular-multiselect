gulp-lintspaces
===============

A thin wrapper of [lintspaces](https://github.com/schorfES/node-lintspaces)

If you're looking for a [gruntjs](http://gruntjs.com/) task to validate your
files, take a look at this one:

* [grunt-lintspaces](https://github.com/schorfES/grunt-lintspaces)

## Installation

This package is available on [npm](https://www.npmjs.org/package/gulp-lintspaces)
as: `gulp-lintspaces`

``` sh
	npm install gulp-lintspaces
```

## Usage

```javascript
var gulp = require("gulp");
var lintspaces = require("gulp-lintspaces");

gulp.task("YOURTASK", function() {
    return gulp.src("**/*.js")
        .pipe(lintspaces(/* options */))
        .pipe(lintspaces.reporter());
});
```

## Options

### newline at end of file option

Tests for newlines at the end of all files. Default value is `false`.

```javascript
	newline: true
```

### maximum newlines option

Test for the maximum amount of newlines between code blocks. Default value is
`false`. To enable this validation a number larger than `0` is expected.

```javascript
	newlineMaximum: 2
```

### trailingspaces option

Tests for useless whitespaces (trailing whitespaces) at each lineending of all
files. Default value is `false`.

```javascript
	trailingspaces: true
```

### indentation options

Tests for correct indentation using tabs or spaces. Default value is `false`.
To enable indentation check use the value `'tabs'` or `'spaces'`.

```javascript
	indentation: 'tabs'
```

If the indentation option is set to `'spaces'`, there is also the possibility
to set the amount of spaces per indentation using the `spaces` option. Default value is `4`.

```javascript
	indentation: 'spaces',
	spaces: 2
```

### ignores option

Use the `ignores` option when special lines such as comments should be ignored.
Provide an array of regular expressions to the `ignores` property.

```javascript
	ignores: [
		/\/\*[\s\S]*?\*\//g,
		/foo bar/g
	]
```

There are some _**build in**_ ignores for comments which you can apply by using
these strings:

* 'js-comments'
* 'c-comments'
* 'java-comments'
* 'as-comments'
* 'xml-comments'
* 'html-comments'
* 'python-comments'
* 'ruby-comments'
* 'applescript-comments'

_(build in strings and userdefined regular expressions are mixable in the
`ignores` array)_

```javascript
	ignores: [
		'js-comments',
		/foo bar/g
	]
```

**Feel free to contribute some new regular expressions as build in!**

### .editorconfig option

It's possible to overwrite the default and given options by setting up a path
to an external editorconfig file by unsing the `editorconfig`option. For a basic
configuration of a _.editorconfig_ file check out the
[EditorConfig Documentation](http://editorconfig.org/).

```javascript
	editorconfig: '.editorconfig'
```

The following .editorconfig values are supported:

* `insert_final_newline` will check if a newline is set
* `indent_style` will check the indentation
* `indent_size` will check the amount of spaces
* `trim_trailing_whitespace` will check for useless whitespaces

## Contribution

Feel free to contribute. Please run all the tests and validation tasks befor
you offer a pull request.

### Tests & validation

Run ```make test``` to run the tests and validation tasks.

### Readme

The readme chapters are located in the _docs_ directory as Markdown. All
Markdown files will be concatenated through a gulp task ```'readme'```. Call
```gulp readme``` or ```make readme``` to update the _README.md_.

**Note: ** Do not edit the _README.md_ directly, it will be overwritten!

## License

[LICENSE (MIT)](https://github.com/ck86/gulp-lintspaces/blob/master/LICENSE)
