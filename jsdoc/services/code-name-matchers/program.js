/**
 * @dgService ProgramNodeMatcher
 * @description Returns code name from node
 */
module.exports = function ProgramNodeMatcherFactory (codeNameService) {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function ProgramNodeMatcher (node) {
    return node.body && node.body[0] && codeNameService.find(node.body[0]) || null;
  }
};
