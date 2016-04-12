/**
 * @dgService MemberExpressionNodeMatcher
 * @description Returns code name from node
 */
module.exports = function MemberExpressionNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function MemberExpressionNodeMatcher (node) {
    return codeNameService.find(node.property) || null;
  }
};
