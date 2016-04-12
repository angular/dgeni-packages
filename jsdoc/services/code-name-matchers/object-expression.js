/**
 * @dgService ObjectExpressionNodeMatcher
 * @description Returns code name from node
 */
module.exports = function ObjectExpressionNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ObjectExpressionNodeMatcher (node) {
    return null;
  }
};
