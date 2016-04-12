/**
 * @dgService AssignmentExpressionNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function AssignmentExpressionNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function AssignmentExpressionNodeMatcher (node) {
    return codeNameService.find(node.right) || codeNameService.find(node.left) || null;
  }
};
