/**
 * @dgService ClassDeclarationNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function FunctionDeclarationNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ClassDeclarationNodeMatcher (node) {
    return node.id && node.id.name || null;
  }
};
