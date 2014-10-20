/**
 * @dgService getJsDocComment
 * @description
 * Look for a leading JSDoc style comment before the given node and return
 * an object containing info about this comment
 * @param {ASTNode} node - the node from which to get the comment
 * @returns { {content: string, startingLine: number, endingLine: number, range: Array} }
 *                             the comment info if found
 */
module.exports = function getJsDocComment(removeASTComment) {

  var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

  return function(node, ast) {

    var comments = node.leadingComments;

    if ( comments && comments.length > 0 ) {
      var commentNode = comments[comments.length-1];

      // We are only interested if the comment is jsdoc style: i.e. starts with "/**""
      // If so, then strip off any leading stars and trim off leading and trailing whitespace
      if ( commentNode.type === 'Block' && commentNode.value.charAt(0) == '*') {

        // If an AST was provided then remove this comment from that AST's comments collection
        if ( ast ) {
          removeASTComment(ast, commentNode.range);
        }

        return {
          content: commentNode.value.replace(LEADING_STAR, '').trim(),
          startingLine: commentNode.loc.start.line,
          endingLine: commentNode.loc.end.line,
          range: commentNode.range
        };
      }

    }
  };
};