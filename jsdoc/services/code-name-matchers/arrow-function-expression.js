/**
 * @dgService ArrowFunctionExpressionNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function ArrowFunctionExpressionNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ArrowFunctionExpressionNodeMatcher (node) {
    return null;
  }
};