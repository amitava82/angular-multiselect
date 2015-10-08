/*
    Licenced Under MIT
    @file gulpfile.js
    @author Nagaraja.T (github/naga2raja)
    @desc Buildfile for angular-multiselect
*/

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence'),
    mergeStream = require('merge-stream'),
    concat = require('gulp-concat'),
    minify = require('gulp-ngmin'),
    order = require('gulp-order'),
    jshint = require('gulp-jshint'),
    lintspaces = require("gulp-lintspaces"),
    templateCache = require("gulp-angular-templatecache"),
    angularFilesort = require("gulp-angular-filesort"),
    jshintsummary = require('jshint-summary'),
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

/* For Future Use -- Currently not used */
gulp.task('scripts', function() {
    return gulp.src('src/*.js')
        .pipe(order([
            "app.js",
            "multiselect.js",
            "multiselect-tpls.js"]))
        .pipe(jshint.reporter('jshint-summary', {
            verbose: true,
            reasonCol: 'cyan,bold',
            codeCol: 'green'
        }))
        .pipe(gulp.dest('dist'));
});

/* For future use to compress */
gulp.task('compress', function() {
    return gulp.src('src/*.js')
        .pipe(minify({dynamic: true}))
        .pipe(gulp.dest('dist'));
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

gulp.task('clean', function() {
    return gulp.src(['dist'], {read: false})
        .pipe(clean());
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
