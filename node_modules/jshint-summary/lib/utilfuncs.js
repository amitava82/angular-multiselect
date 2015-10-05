'use strict';

var chalk = require('chalk');
var Table = require('cli-table');


// ----------------------------------------------------------------------------

var tableChars = {
  'top': '' ,
  'top-mid': '' ,
  'top-left': '' ,
  'top-right': '',
  'bottom' : '' ,
  'bottom-mid': '' ,
  'bottom-left': '' ,
  'bottom-right': '',
  'left': ' ',
  'left-mid': '',
  'mid': '',
  'mid-mid': '',
  'right-mid': '',
  'right': '',
  'middle': '  '
};


var createTable = exports.createTable = function(options) {
  return new Table({
    chars: tableChars,
    style : {
      compact : true,
      head: [ options.labelCol ],
      'padding-left' : 0,
      'padding-right' : 0
    }
  })
}


// ----------------------------------------------------------------------------

var extend = exports.extend = function(dest) {
  dest = dest || {};
  [].slice.call(arguments, 1).forEach(function(src) {
    if (typeof src === "object") {
      for (var k in src) {
        dest[k] = src[k];
      }
    }
  });
  return dest;
}


// ----------------------------------------------------------------------------

var chain = exports.chain = function(f) {
  if (arguments.length === 1) {
    return f;
  }

  var funcs = [].slice.call(arguments).reverse();

  return function(value) {
    return funcs.reduce(function(v, func) {
      return func(v);
    }, value);
  }
}

var chainFrom = exports.chainFrom = function(arr) {
  return chain.apply(null, arr);
}


var mapfilter = exports.mapfilter = function(arr, func) {
  return arr.reduce(function(dest, cur, idx, arr) {
    var res = func(cur, idx, arr);

    if (typeof res !== 'undefined') {
      dest.push(res);
    }

    return dest;
  }, []);
}


// ----------------------------------------------------------------------------

var propertygetter = exports.propertygetter = function(name, ownOnly) {
  return ownOnly ? function(obj) { return obj.getOwnProperty(name) } : function(obj) { return obj[name]; };
}

var keygetter = exports.keygetter = function(obj, ownOnly) {
  return ownOnly ? function(name) { return obj.getOwnProperty(name) } : function(name) { return obj[name]; };
}


function strip(text) {
  return text.trim();
}


// ----------------------------------------------------------------------------

var mapToEachLine = exports.mapToEachLine = function(text, func, trim) {
  if (typeof func === 'function') {
    if (trim === true) {
      func = chain(func, strip);
    }
  }
  else if (func === true) {
    func = strip;
  }

  var lines = text.split(/\r?\n/g);

  if (typeof func === 'function') {
    lines = lines.map(func);
  }

  return lines.join('\n');
}


var pluralise = exports.pluralise = function(word, count) {
  return word + (count !== 1 ? 's' : '');
}


// ----------------------------------------------------------------------------


var paintbrush = exports.paintbrush = function(colour) {
  var chalkFuncs = mapfilter(colour.split(','), keygetter(chalk));

  if (chalkFuncs.length === 0) {
    return function(text) {
      return text
    }
  }

  var chalkFunc = chainFrom(chalkFuncs.reverse());

  return function(text) {
    return mapToEachLine(text, chalkFunc, true);
  }
}


var paint = exports.paint = function(colour, text) {
  return paintbrush(colour)(text);
}

