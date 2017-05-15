/* global module */
/* global require */

module.exports = function() {
  var appSrc='./src/';
  var distDir='./dist/';

  var config={
    temp: './.tmp/',

//    distFiles: [appSrc+'js/inputDateField.js',appSrc+'html/inputDateField.tmpl.html'],
    distJsFiles: appSrc+'js/multiselect.js',
    distHtmlFiles: appSrc+'html/multiselect.tmpl.html',
    distCssFiles: appSrc+'css/multiselect.css',

    // all js to vet
    alljs: ['./*.js','./src/js/*.js'],
    allcss: [appSrc+'*.css',appSrc+'css/*.css'],
    allhtml: [appSrc+'*.html',appSrc+'html/*.html'],
    index: './src/index.html',
    js: [appSrc+'js/*.js'],
    css: [appSrc+'*.css',appSrc+'css/*.css'],
//    less: ['./src/*.less','./src/modules/less/*.less'],


    bowerJSON: './bower.json',
    bower: {
      json: require('./bower.json'),
      directory: './src/lib/',
      ignorePath: '..'
    },

    optimized: {
      lib: 'lib.js',
      app: 'app.js'
    },

    htmlAngularValidate: {
      customattrs: [''],
      customtags: ['']
    },

    source: appSrc,
    build: './gh-pages/',
    dist: distDir,
    resources: './src/resources/*',
    images: './src/resources/images/*',
    json: './src/resources/json/*.json',

    htmltemplates: [appSrc+'**/**/*.html',appSrc+'**/*.html','!'+appSrc+'index.html'],
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'am.multiselect',
        standAlone: true//,
        //root: '/'
      }
    },

    htmltemplatesDist: [distDir+'**/**/*.html',distDir+'**/*.html'],
    templateCacheDist: {
      file: 'templates.js',
      options: {
        module: 'am.multiselect',
        standAlone: true//,
        //root: '/'
      }
    }


  };

  config.getWiredepDefaultOptions = function() {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
    return options;
  };

  config.getWebserverOptions = function() {
    var options = {
      livereload: true,
      directoryListing: false,
      open: true,
      host: 'localhost',
      port: 3000,
      path: '/',
      https: false
    };
    return options;
  }

  return config;
}
