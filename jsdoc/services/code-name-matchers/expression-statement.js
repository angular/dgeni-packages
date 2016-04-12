/**
 * @dgService ExpressionStatementNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function ExpressionStatementNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ExpressionStatementNodeMatcher (node) {
    return codeNameService.find(node.expression) || null;
  }
};
