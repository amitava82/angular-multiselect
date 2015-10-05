'use strict';

var wordwrap = require('wordwrap');
var utils = require('./utilfuncs');


// ----------------------------------------------------------------------------

var symbols = {
  tick: '√',
  cross: '×'
}

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


// ----------------------------------------------------------------------------

function underline(s, c) {
  return s + '\n' + new Array(s.length + 1).join(c || '-');
}

// ----------------------------------------------------------------------------

function getBrushes(options) {
  var brushes = {};
  'file position reason code errors ok label variable'.split(' ').forEach(function(k) {
    brushes[k] = utils.paintbrush(options[k + 'Col'] || 'white');
  });
  return brushes;
}


// ----------------------------------------------------------------------------

// The reporter function itself.
var reporter = exports.reporter = function(result, data, options) {
  options = utils.extend({}, defaultOptions, options);
  // console.dir(options);

  var prevfile;
  var fileCount = 0;
  var lines = [];
  var table;

  var wordwrapper = options.wordWrap ? wordwrap(0, options.width) : function(s) { return s };
  var brush = getBrushes(options);


  // Issues found.
  result.forEach(function(item) {
    if (item.file !== prevfile) {
      if (table) {
        lines.push(table.toString());
      }

      lines.push('');
      lines.push(brush.file(underline(item.file)));

      table = utils.createTable(options);
      prevfile = item.file;
      fileCount += 1;
    }

    var err = item.error;
    var line = [
      brush.code(err.code),
      brush.position('Line ' + err.line + ', Col ' + err.character),
      brush.reason(err.reason)
    ];

    table.push(line);
  });

  if (table) {
    lines.push(wordwrapper(table.toString()));
  }

  // Final summary line
  if (result.length > 0) {
    var summ = [symbols.cross, result.length, utils.pluralise('problem', result.length),
      'in', fileCount, utils.pluralise('file', fileCount)];

    lines.push(brush.errors('  ' + summ.join(' ')));
  }
  else {
    lines.push(brush.ok('  ' + symbols.tick + ' No problems'));
  }

  lines.push('');

  // Various code statistics.
  if (options.statistics) {
    data.forEach(function(data) {
      if (data.implieds || data.unused || data.globals) {
        lines.push('');
        lines.push(brush.file(underline(data.file)));

        table = utils.createTable(options);

        if (data.globals) {
          table.push({
            'Module globals:': brush.variable(data.globals.sort().join(', '))
          });
        }

        if (data.implieds) {
          table.push({
            'Implied globals:': data.implieds.map(function (global) {
              return brush.variable(global.name)  + ' @ line ' + global.line;
            }).join(', ')
          });
        }

        if (data.unused) {
          table.push({
            'Unused variables:': data.unused.map(function (unused) {
              return brush.variable(unused.name)  + ' @ line ' + unused.line;
            }).join(', ')
          });
        }

        lines.push(wordwrapper(table.toString()) + '\n');
      }
    });
  }

  console.log(lines.join('\n'));
};

