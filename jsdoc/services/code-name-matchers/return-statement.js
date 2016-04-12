/**
 * @dgService ReturnStatementNodeMatcher
 * @description Returns code name from node
 */
module.exports = function ReturnStatementNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ReturnStatementNodeMatcher (node) {
    return codeNameService.find(node.argument) || null;
  }
};
