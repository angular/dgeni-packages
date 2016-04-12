/**
 * @dgService FunctionDeclarationNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function FunctionDeclarationNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function FunctionDeclarationNodeMatcher (node) {
    return node.id && node.id.name || null;
  }
};
