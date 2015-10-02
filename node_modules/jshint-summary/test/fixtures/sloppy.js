

function foo(x) {
  var x = x || 'BATR';
  i = 0;
}

var frames = []

var alert = function(s) { console.warn(s) },
  v = function() { return 'value' }()

if (frames.length == 0) alert('OMG!')

AFunc = function(s) {
    console.log("bad indenting...")
}()
