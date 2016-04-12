/**
 * @dgService ExportDefaultDeclarationNodeMatcher
 * @returns {String|Null} code name from node
 */
module.exports = function ExportDefaultDeclarationNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ExportDefaultDeclarationNodeMatcher (node) {
    return null;
  }
};
