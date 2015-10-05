'use strict';

var path = require('path');


function sum(a, b) {
  return a + b;
}


var curdir = process.cwd();

console.info('The current directory is', path.basename(curdir));
