/**
 * @dgService MethodDefinitionNodeMatcher
 * @description Returns code name from node
 */
module.exports = function MethodDefinitionNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function MethodDefinitionNodeMatcher (node) {
    return codeNameService.find(node.key) || null;
  }
};
