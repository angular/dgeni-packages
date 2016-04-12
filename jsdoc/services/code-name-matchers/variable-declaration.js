/**
 * @dgService VariableDeclarationNodeMatcher
 * @description Returns code name from node
 */
module.exports = function VariableDeclarationNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function VariableDeclarationNodeMatcher (node) {
    return node.declarations && node.declarations[0] && codeNameService.find(node.declarations[0]) || null;
  }
};
