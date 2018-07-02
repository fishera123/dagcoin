var path = require('path');
var _root = path.resolve(__dirname, '..');
function root(args) {
    console.log('DIR-NAME:' + __dirname);
    args = Array.prototype.slice.call(arguments, 0);
    var result = path.join.apply(path, [_root].concat(args));
    console.log('ROOT:' + result);
}
exports.root = root;
