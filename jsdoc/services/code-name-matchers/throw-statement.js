/**
 * @dgService ThrowStatementNodeMatcher
 * @description Returns code name from node
 */
module.exports = function ThrowStatementNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ThrowStatementNodeMatcher (node) {
    return codeNameService.find(node.argument) || null;
  }
};
