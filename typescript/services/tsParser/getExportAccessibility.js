var ts = require('typescript');

module.exports = function getExportAccessibility() {


  return function(symbol) {
    var node = symbol.declarations[0];
    if (!node) return 'public';
    if(node.flags & ts.NodeFlags.Private) {
      return 'private';
    }
    if(node.flags & ts.NodeFlags.Protected) {
      return 'protected';
    }
    return 'public';
  };
};