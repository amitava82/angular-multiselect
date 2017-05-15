/* global require */
/* eslint angular/typecheck-object: "off" */
/* eslint angular/definedundefined: "off" */

const gulp = require('gulp');
const args = require('yargs').argv;
var config = require('./gulp.config')();
const del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var serveStatic=require('serve-static');
var parseurl = require('parseurl')

gulp.task('help', $.taskListing);
gulp.task('default',['help']);

gulp.task('lintjs', function () {
  log('Analyzing JS files');
  return gulp.src(config.alljs)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('lintcss', function () {
  log('Analyzing CSS files');
  return gulp.src(config.allcss)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.csslint())
    .pipe($.csslint.formatter())
    .pipe($.csslint.failFormatter());
});

gulp.task('linthtml', function () {
  log('Analyzing HTML files');
  var options = {
    customattrs: config.htmlAngularValidate.customattrs,
    customtags: config.htmlAngularValidate.customtags,
    emitError: true,
    reportpath: null,
    reportCheckstylePath: null,
    reportFn:function(fileFailures){
        for (var i = 0; i < fileFailures.length; i++) {
            var fileResult = fileFailures[i];
            $.util.log(fileResult.filepath);
            for (var j = 0; j < fileResult.errors.length; j++) {
                var err = fileResult.errors[j];
                if (err.line !== undefined) {
                    $.util.log('[line' +err.line +', col: ' + err.col +'] ' +err.msg);
                } else {
                    $.util.log(err.msg);
                }
            }
        }
    }
  };
  return gulp.src(config.allhtml)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.htmlAngularValidate(options));
});

gulp.task('lintjson', function () {
  log('Analyzing JSON files');
  return gulp.src(config.json)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter(myCustomReporter))
    .pipe($.jsonlint.failAfterError());
});

gulp.task('wireindex',['lintjs','linthtml','lintcss','lintjson'] , function() {
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  log('Linking all js/css files into index.html');
  return gulp
    .src(config.index)
    .pipe($.if(args.verbose,$.print()))
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.js,{read:false}),{relative:true}))
    .pipe($.inject(gulp.src(config.css,{read:false}),{relative:true}))
    .pipe(gulp.dest(config.source));
});

gulp.task('serve', function() {
  log('Starting webserver for - '+($.util.env.production?'PROD':'DEV'));
  var options = config.getWebserverOptions();
  gulp
    .src($.util.env.production?config.build:config.source)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.webserver(options));
});

gulp.task('resources', function() {
  log('copying resources');
  return gulp
    .src(config.resources)
    .pipe(gulp.dest(config.build+'resources'));
});

gulp.task('jsoncopy', function() {
  log('copying and minifying json resources');
  return gulp
    .src(config.json)
    .pipe($.jsonminify())
    .pipe(gulp.dest(config.build+'resources/json'));
});

gulp.task('htmlcopy', ['fontscopy'], function() {
  log('copying html files for making it ready for templatecache');
  return gulp
    .src(config.htmltemplates)
    .pipe($.flatten())
    .pipe(gulp.dest(config.temp+'html/'));
});

gulp.task('fontscopy', ['clean'], function() {
  log('copying bootstrap and other fonts');
  var filterFonts = $.filter('**/*.{eot,svg,ttf,woff,woff2}', { restore: true });

  return gulp
    .src(config.bowerJSON)
    .pipe($.mainBowerFiles())
    .pipe(filterFonts)
    .pipe($.flatten())
    .pipe(gulp.dest(config.build+'fonts/'));
});

gulp.task('images', function() {
  log('copying and compressing images');
  return gulp
    .src(config.images)
    .pipe($.imagemin({optimizationLevel:4}))
    .pipe(gulp.dest(config.build+'resources/images'));
});

gulp.task('clean', function(done){
  var delconfig=[].concat(config.build,config.temp,config.dist);
  log('cleaning '+$.util.colors.blue(delconfig));
  return del(delconfig,done);
});

gulp.task('templatecache',['fontscopy'],function(){
  log('creating AngularJS $templateCache');
  return gulp
    .src(config.htmltemplates)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.minifyHtml({empty:true}))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
      ))
    .pipe(gulp.dest(config.temp));
});

gulp.task('optimize',['wireindex','templatecache'],function() {
  log('optimizing the js/html/css files');
  var assets = $.useref({searchPath: './src/'});
  var templateCache = config.temp+config.templateCache.file;
  var cssFilter = $.filter('**/*.css',{restore:true});
  var jsLibFilter = $.filter('**/'+config.optimized.lib,{restore:true});
  var jsAppFilter = $.filter('**/'+config.optimized.app,{restore:true});
  return gulp
    .src(config.index)
    //.pipe($.plumber())
    .pipe($.inject(gulp.src(templateCache,{read:false}), {
      starttag: '<!-- inject:templates:js -->',
      relative: true
      }))
    .pipe(assets)
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe($.rev())
    .pipe(cssFilter.restore)
    .pipe(jsLibFilter)
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(jsLibFilter.restore)
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate({add:true}))
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(jsAppFilter.restore)
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.build));
});

gulp.task('testTask', function() {
  return gulp
    .src(config.bowerJSON)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.mainBowerFiles())
    .pipe(gulp.dest(config.temp));
});

gulp.task('copyDistJS', ['clean'], function() {
  var copyconfig=[].concat(config.distJsFiles);
  log('copying distribution JS files');
  return gulp
    .src(copyconfig)
    .pipe(gulp.dest(config.dist+'js/'));
});

gulp.task('copyDistHTML', ['copyDistJS'], function() {
  var copyconfig=[].concat(config.distHtmlFiles);
  log('copying distribution HTML files');
  return gulp
    .src(copyconfig)
    .pipe(gulp.dest(config.dist+'html/'));
});

gulp.task('copyDistCSS', ['copyDistHTML'], function() {
  var copyconfig=[].concat(config.distCssFiles);
  log('copying distribution CSS files');
  return gulp
    .src(copyconfig)
    .pipe(gulp.dest(config.dist+'css/'));
});

gulp.task('templatecachedist',['copyDistCSS'],function(){
  log('creating AngularJS $templateCache for dist');
  return gulp
    .src(config.htmltemplatesDist)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.minifyHtml({empty:true}))
    .pipe($.angularTemplatecache(
      config.templateCacheDist.file,
      config.templateCacheDist.options
      ))
    .pipe(gulp.dest(config.dist+'js/'));
});

gulp.task('distribute', ['templatecachedist'], function() {
  log('optimizing the dist files');
  var cssFilter = $.filter('**/*.css',{restore:true});
  var jsFilter = $.filter('**/*.js',{restore:true});
  var htmlFilter = $.filter('**/*.html',{restore:true});

  return gulp
    .src(config.dist+'**/*')
    .pipe(cssFilter)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(cssFilter.restore)
    .pipe(jsFilter)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(jsFilter.restore)
    .pipe(htmlFilter)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.minifyHtml({empty:true}))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(config.dist));
});

gulp.task('serve-dev',['wireindex'],function() {
  log('Starting webserver for - DEV');
  var options = config.getWebserverOptions();
  options.middleware=[getStatic({route: /^\/json/, handle: serveStatic('resources')})];
  gulp
    .src(config.source)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.webserver(options));
});

gulp.task('serve-prod',['optimize'],function() {
  log('Starting webserver for - PROD');
  var options = config.getWebserverOptions();
  options.middleware=[getStatic({route: /^\/json/, handle: serveStatic('resources')})];
  gulp
    .src(config.build)
    .pipe($.if(args.verbose,$.print()))
    .pipe($.webserver(options));
});

//gulp.task('bump', function() {
//  // not using this -- mainly for bumping the npm version in package.json
//});

//gulp.task('lintHTML', function () {
//  log('Analyzing HTML files');
//  return gulp.src(config.allhtml)
//    .pipe($.if(args.verbose,$.print()))
//    .pipe($.htmllint({failOnError: true}, htmllintReporter));
//});

//gulp.task('styles', function() {
//  log('compiling Less --> CSS');
//
//  return gulp
//    .src(config.less)
//    .pipe($.less())
//    .pipe($.autoprefixer({browsers: ['last 2 version','> 5%']}))
//    .pipe(gulp.dest(config.temp));
//
//});

////////////////////

function log(msg) {
  if(typeof(msg)==='object') {
    for(var item in msg) {
      if(msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

var myCustomReporter = function (file) {
    $.util.log('File ' + file.path + ' is not valid JSON.');
};

function getStatic(opts) {
  return function(req, res, next) {
    if (parseurl(req).pathname.match(opts.route)) {
      return opts.handle(req, res, next);
    } else {
      return next();
    }
  }
}

//function htmllintReporter(filepath, issues) {
//    if (issues.length > 0) {
//        issues.forEach(function (issue) {
//            $.util.log($.util.colors.cyan('[gulp-htmllint] ') + $.util.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + $.util.colors.red('(' + issue.code + ') ' + issue.msg));
//        });
//        //process.exitCode = 1;
//      this.emit('error', new $.util.PluginError('gulp-htmllint', 'Linter errors occurred!'));
//      this.emit('end');
//    }
//}
