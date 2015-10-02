
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var summary = require('jshint-summary');


// ----------------------------------------------------------------------------
// Lints all .js files under src/ using jshint-summary as the reporter

gulp.task('jshint', function() {
  return gulp.src('app/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-summary', {
      statistics: true,
      fileCol: 'yellow,bold'
    }));
});


// ----------------------------------------------------------------------------

gulp.task('default', ['jshint']);
