/**
 * @dgService LiteralNodeMatcher
 * @description Returns code name from node
 */
module.exports = function LiteralNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function LiteralNodeMatcher (node) {
    return node.value || null;
  }
};
