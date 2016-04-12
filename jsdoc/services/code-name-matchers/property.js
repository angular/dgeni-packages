/**
 * @dgService PropertyNodeMatcher
 * @description Returns code name from node
 */
module.exports = function PropertyNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function PropertyNodeMatcher (node) {
    return codeNameService.find(node.value) || codeNameService.find(node.key);
  }
};
