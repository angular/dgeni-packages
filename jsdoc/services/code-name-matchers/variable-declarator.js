/**
 * @dgService VariableDeclaratorNodeMatcher
 * @description Returns code name from node
 */
module.exports = function VariableDeclaratorNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function VariableDeclaratorNodeMatcher (node) {
    return node.id && node.id.name || null;
  }
};
