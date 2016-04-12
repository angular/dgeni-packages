/**
 * @dgService FunctionExpressionNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function FunctionExpressionNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function FunctionExpressionNodeMatcher (node) {
    return node.id && node.id.name || null;
  }
};
