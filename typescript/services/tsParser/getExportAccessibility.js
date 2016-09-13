var ts = require('typescript');

module.exports = function getExportAccessibility() {


  return function(declaration) {
    if (!declaration) return 'public';
    if(declaration.flags & ts.NodeFlags.Private) {
      return 'private';
    }
    if(declaration.flags & ts.NodeFlags.Protected) {
      return 'protected';
    }
    return 'public';
  };
};