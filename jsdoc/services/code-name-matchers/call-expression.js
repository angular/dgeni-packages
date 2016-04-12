/**
 * @dgService CallExpressionNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function CallExpressionNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function CallExpressionNodeMatcher (node) {
    return codeNameService.find(node.callee) || null;
  }
};
