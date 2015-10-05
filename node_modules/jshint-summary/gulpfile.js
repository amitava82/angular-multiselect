'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();
var args   = require('yargs').argv;

require('coffee-script/register');


// ----------------------------------------------------------------------------

// e.g. gulp bump --type minor
gulp.task('bump', function() {
  var bumpType = args.t || args.type || 'patch';

  return gulp.src('./package.json')
  .pipe(plugins.bump({ type: bumpType }))
  .pipe(gulp.dest('./'));
});


// ----------------------------------------------------------------------------
// Lints the files in test/fixtures/ using this as the reporter

gulp.task('demo', function() {
  return gulp.src(['test/fixtures/clean.js', 'test/fixtures/sloppy.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('./', {
      statistics: true,
      fileCol: 'yellow,bold'
    }));
});


// ----------------------------------------------------------------------------
// Lint and run unit tests

gulp.task('lint', function() {
  return gulp.src('lib/*.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('./', {
      statistics: false
    }));
});


gulp.task('mocha', function() {
  return gulp.src(['test/utilfuncs.spec.js', 'test/summary.spec.coffee', 'test/gulp.spec.coffee'])
    .pipe(plugins.mocha({
      useColors: !!args.color,
      reporter: 'spec'
    }))
});

// gulp.task('mocha', function(cb) {
//   gulp.src(['lib/**/*.js', 'main.js'])
//     .pipe(plugins.istanbul())
//     .on('end', function() {
//       gulp.src('./test/**/*.js')
//       .pipe(plugins.mocha({
//         useColors: !!args.color,
//         reporter: 'spec'
//       }))
//       .pipe(plugins.istanbul.writeReports('./test/coverage'))
//       .on('end', cb);
//     });
// });

gulp.task('test', ['lint', 'mocha']);


// ----------------------------------------------------------------------------

gulp.task('watch', ['test'], function() {
  gulp.watch(['lib/*.js', 'test/*.js'], ['test']);
});

gulp.task('default', ['watch']);
