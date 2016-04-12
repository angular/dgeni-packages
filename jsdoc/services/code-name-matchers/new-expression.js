/**
 * @dgService NewExpressionNodeMatcher
 * @description Returns code name from node
 */
module.exports = function NewExpressionNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function NewExpressionNodeMatcher (node) {
    return codeNameService.find(node.callee) || null;
  }
};
