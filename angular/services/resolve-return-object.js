'use strict';


module.exports = function resolveReturnObject(log, resolveIdentifierNode, resolveObject) {
  return function(doc, value) {
    var result = [];
    value.body.body.some(function(statement) {
      if (statement.type !== 'ReturnStatement') {
        return;
      }
      var returnValue = statement.argument;
      result = resolveObject(doc, returnValue);
      return true;
    });
    return result;
  };
};
