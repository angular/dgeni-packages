/**
 * @dgService IdentifierNodeMatcher
 * @description Creates code name matcher for AST entry
 */
module.exports = function IdentifierNodeMatcherFactory () {
  /**
   * @param {Node} node AST node to process
   * @returns {String|Null} code name from node
   */
  return function IdentifierNodeMatcher (node) {
    return node.name || null;
  }
};
