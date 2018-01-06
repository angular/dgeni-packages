/**
 * @dgService ExportNamedDeclarationNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function ExportNamedDeclarationNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ExportNamedDeclarationNodeMatcher (node) {
    return codeNameService.find(node.right) || null;
  }
};
