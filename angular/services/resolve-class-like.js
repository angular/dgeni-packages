'use strict';

var util = require('../util');


module.exports = function resolveClassLike(log, resolveIdentifierNode) {
  return function(doc, value) {
    var result = [];
    value.body.body.some(function(statement) {
      // No valid members can be declared after a return statement,
      if (statement.type === 'ReturnStatement') {
        return true;
      }
      // Probably a function declaration, ignoring...
      if (statement.type !== 'ExpressionStatement') {
        return;
      }
      var expression = statement.expression;
      // As far as we're concerned, only assignments can define members.
      if (expression.type !== 'AssignmentExpression') {
        return;
      }
      // Not interested in variable assignments.
      if (expression.left.type !== 'MemberExpression') {
        return;
      }
      // Not an assignment to `this`.
      if (expression.left.object.type !== 'ThisExpression') {
        return;
      }
      var resolved = resolveIdentifierNode(expression.right);
      if (/Function/.test(resolved.type)) {
        var name = doc.autoTags.name[0] + '#' + expression.left.property.name;
        result.push({
          docType: 'autoDoc',
          fileInfo: doc.fileInfo,
          autoTags: {
            ngdoc: ['method'],
            name: [name]
          },
          content: util.getMatchingJSDoc([].concat(statement.leadingComments, resolved.leadingComments))
        });
      }
    });
    return result;
  };
};
