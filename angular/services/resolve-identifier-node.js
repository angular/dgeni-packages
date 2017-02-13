'use strict';


module.exports = function resolveIdentifierNode(escopeMap) {
  return function(node) {
    if (node.type !== 'Identifier') {
      return node;
    }
    var scope = escopeMap.get(node);
    var result = null;
    scope.variables.some(function(variable) {
      if (variable.name !== node.name) {
        return;
      }
      return variable.defs.some(function(def) {
        if (def.type === 'FunctionName') {
          result = def.node;
          return true;
        }
      });
    });
    return result;
  };
};
