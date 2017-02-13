'use strict';

var util = require('../util');


module.exports = function resolveObject(log, resolveIdentifierNode) {
  return function(doc, value) {
    if (value.type === 'FunctionExpression') {
      // XXX Handle @kind function
    }
    if (value.type === 'ObjectExpression') {
      return value.properties.map(function(property) {
        var name = doc.autoTags.name[0] + '#' + property.key.name;
        var propertyValue = resolveIdentifierNode(property);
        return {
          docType: 'autoDoc',
          fileInfo: doc.fileInfo,
          autoTags: {
            ngdoc: ['method'],
            name: [name]
          },
          content: util.getMatchingJSDoc([].concat(property.leadingComments, propertyValue.leadingComments))
        };
      });
    }
  };
};
