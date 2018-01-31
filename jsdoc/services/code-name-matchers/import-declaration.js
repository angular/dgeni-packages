/**
 * @dgService ImportDeclarationNodeMatcher
 * @description Creates code name matcher for AST entry
 */
module.exports = function ImportDeclarationNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ImportDeclarationNodeMatcher (node) {
    return node.source && node.source.value || null;
  }
};
