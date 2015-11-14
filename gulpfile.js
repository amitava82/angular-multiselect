/*
    Licenced Under MIT
    @file gulpfile.js
    @author Nagaraja.T (github/naga2raja)
    @desc Buildfile for angular-multiselect
*/

var gulp = require('gulp'),
    del = require('del'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence'),
    mergeStream = require('merge-stream'),
    concat = require('gulp-concat'),
    lintspaces = require("gulp-lintspaces"),
    templateCache = require("gulp-angular-templatecache"),
    angularFilesort = require("gulp-angular-filesort"),
    lintspacesConfig = {
        indentation: 'spaces',
        spaces: 4,
        trailingspaces: true,
        ignores: [
            'js-comments'
        ]
    };

/*
 Gulp monitors the src tree and rebuilds it detects a modification. Used of dev purpose
*/
gulp.task('watch', function() {
    watch("src/**/*.*", function() {
        gulp.start("build-clean");
    });
});

gulp.task('default', ['build-clean'], function() {
});

/*
 Check for lintspaces errors in source code
*/
gulp.task('whitespace', function() {
    return gulp.src([
            'src/*.js',
            'src/*.html',
            'src/*.css'])
        .pipe(lintspaces(lintspacesConfig))
        .pipe(lintspaces.reporter());
});

gulp.task('js', ['build-multiselect-tpls.js'], function () {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('build-multiselect-tpls.js', function () {
    var templateJsStream =  gulp
        .src('src/multiselect.tmpl.html')
        .pipe(templateCache({ module: 'am.multiselect' }));

    var combinedStream = mergeStream(templateJsStream, gulp.src('src/multiselect.js'));

    combinedStream
        .pipe(angularFilesort())
        .pipe(concat('multiselect-tpls.js'))
        .pipe(gulp.dest('dist'));

});

gulp.task('css', function () {
    return gulp.src('src/*.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
    return del(['dist']);
});

/*
 Need to finish clean before building all the other stuff, and all other stuff
 needs to complete before injecting build artifacts into index.html.
*/
gulp.task('build-clean', function () {
    console.log("----------------------");
    sequence('clean',
            'whitespace',
            ['js','css'],
            'html'
            );
});
