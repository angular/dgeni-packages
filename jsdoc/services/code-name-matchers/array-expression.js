/**
 * @dgService ArrayExpressionNodeMatcher
 * @description Creates code name matcher for AST entry
 */
module.exports = function ArrayExpressionNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ArrayExpressionNodeMatcher (node) {
    return null;
  }
};
