/**
 * @dgService getJsDocComment
 * @description
 * Look for a leading JSDoc style comment before the given node and return
 * an object containing info about this comment
 * @param {ASTNode} node - the node from which to get the comment
 * @returns { {content: string, startingLine: number, endingLine: number, range: Array} }
 *                             the comment info if found
 */
module.exports = function getJsDocComment() {

  var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

  return function(node) {

    var comments = node.leadingComments;

    if ( comments && comments.length > 0 ) {
      var comment = comments[comments.length-1];

      // We are only interested if the comment is jsdoc style: i.e. starts with "/**""
      // If so, then strip off any leading stars and trim off leading and trailing whitespace
      if ( comment.type === 'Block' && comment.value.charAt(0) == '*') {

        return {
          content: comment.value.replace(LEADING_STAR, '').trim(),
          startingLine: comment.loc.start.line,
          endingLine: comment.loc.end.line,
          range: comment.range
        };
      }

    }
  };
};