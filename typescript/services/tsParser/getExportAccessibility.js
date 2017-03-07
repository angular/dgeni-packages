var ts = require('typescript');

module.exports = function getExportAccessibility() {


  return function(declaration) {
    if (!declaration) return 'public';
    const flags = ts.getCombinedModifierFlags(declaration);
    if (flags & ts.ModifierFlags.Private) {
      return 'private';
    }
    if (flags & ts.ModifierFlags.Protected) {
      return 'protected';
    }
    return 'public';
  };
};