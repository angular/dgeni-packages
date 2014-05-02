var _ = require('lodash');
var log = require('dgeni').log;

/**
 * @dgProcessor code-name
 * @description  Infer the name of the document from name of the following code
 */
module.exports = {
  name: 'code-name',
  runAfter: ['files-read'],
  runBefore: ['processing-docs'],
  process: function(docs) {
    _.forEach(docs, function(doc) {
      doc.codeName = doc.codeNode && findCodeName(doc.codeNode.node);
    });
    return docs;
  }
};

/**
 * Recurse down the code AST node that is associated with this doc for a name
 * @param  {Object} node The esprima node information for the code to find the name of
 * @return {String}      The name of the code or null if none found.
 */
function findCodeName(node) {
  var match;
  switch(node.type) {
    case 'FunctionDeclaration':
      return node.id && node.id.name;
    case 'ExpressionStatement':
      return findCodeName(node.expression);
    case 'AssignmentExpression':
      return findCodeName(node.right) || findCodeName(node.left);
    case 'FunctionExpression':
      return node.id && node.id.name;
    case 'MemberExpression':
      return findCodeName(node.property);
    case 'CallExpression':
      return findCodeName(node.callee);
    case 'Identifier':
      return node.name;
    case 'ReturnStatement':
      return findCodeName(node.argument);
    case 'Property':
      return findCodeName(node.value) || findCodeName(node.key);
    case 'ObjectExpression':
      return null;
    case 'ArrayExpression':
      return null;
    case 'Literal':
      return node.value;
    case 'Program':
      return node.body[0] ? findCodeName(node.body[0]) : null;
    case 'VariableDeclaration':
      return findCodeName(node.declarations[0]);
    case 'VariableDeclarator':
      return node.id && node.id.name;
    default:
      log.warn('HELP! Unrecognised node type: ' + node.type);
      log.warn(node);
      return null;
  }
}