# jshint-summary

> Reporter for [JSHint](https://github.com/jshint/jshint).

[![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Dev. Dependency Status][daviddm-dev-image]][daviddm-dev-url]


A customisable reporter for that was inspired by [jshint-stylish](https://npmjs.org/package/jshint-stylish),
but designed to be more readable by default on all platforms and provide configuration options so that users
can customise the report for themselves. It can also report a summary of the code statistics that JSHint generates.


## Install

Install with [npm](https://npmjs.org/package/jshint-summary):

```sh
npm install --save-dev jshint-summary
```


## Getting started

This module can be used as a JSHint reporter both directly via the command-line or as part of
a build system using either [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/).


#### JSHint on the command-line

```sh
jshint --reporter node_modules\jshint-summary\lib\summary file.js
```


#### [gulp-jshint](https://github.com/wearefractal/gulp-jshint)

```js
gulp.task('jshint', function () {
  return gulp.src(['app/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-summary', {
      verbose: true,
      reasonCol: 'cyan,bold'
    }));
});
```

If you are using a version of `gulp-jshint` before __1.5.5__ your settings won't be passed
to the reporter, which will use just the default settings.


#### [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)

```js
grunt.initConfig({
  jshint: {
    options: {
      reporter: require('jshint-summary')
    },
    target: ['file.js']
  }
});
```

If you are using a version of `grunt-contrib-jshint` before __0.9.0__ your settings won't be passed
to the reporter, which will use just the default settings.


## Options

The default settings are:

```js
var defaultOptions = {
  verbose: true,
  statistics: false,
  width: 120,
  wordWrap: false,
  fileCol: 'yellow,bold',
  positionCol: 'white',
  reasonCol: 'cyan,bold',
  codeCol: 'green',
  errorsCol: 'red,bold',
  okCol: 'green',
  labelCol: 'green',
  variableCol: 'white,bold'
};
```


#### `verbose`

Default `true`, if `true` then show the JSHint error code for each issue.

#### `statistics`

Defaults to `false`. If `true` then after reporting all issues found, the reporter will display various statistics JSHint generates - currently unused and implied global variables in each file.

#### `wordWrap`, `width`

Allows text to be wrapped at a particular width, the default values are `false` and `120` at the moment, as the implementation needs improving.

#### `fileCol`, `positionCol`, `reasonCol`, `codeCol`, `errorsCol`, `okCol`, `labelCol`, `variableCol`

Each of these represents the colour of part of the output - `fileCol` is the current file name, `positionCol`, `reasonCol` and `codeCol` are the colours of the columns for each issue, `errorsCol` and `okCol` are the colours of the summary line, and `labelCol` and `variableCol` are the labels and variables that are listed if you are showing the extra statistics. You can set them to a string with any of the values 'white', 'grey', 'red', 'green', 'blue', 'yellow', 'cyan' or 'magenta', and optionally add 'bold' after a comma as well e.g.

```js
    ...
    fileCol: 'red,bold',
    reasonCol: 'green,bold',
    codeCol: 'white'
    ...
```


## License

BSD © [James Skinner](http://github.com/spiralx)


[npm-url]: https://npmjs.org/package/jshint-summary
[npm-image]: https://badge.fury.io/js/jshint-summary.svg
[daviddm-url]: https://david-dm.org/spiralx/jshint-summary
[daviddm-image]: https://david-dm.org/spiralx/jshint-summary.svg?theme=shields.io
[daviddm-dev-url]: https://david-dm.org/spiralx/jshint-summary#info=devDependencies
[daviddm-dev-image]: https://david-dm.org/spiralx/jshint-summary/dev-status.svg?theme=shields.io
[travis-url]: https://travis-ci.org/spiralx/jshint-summary
[travis-image]: https://travis-ci.org/spiralx/jshint-summary.svg?branch=master
