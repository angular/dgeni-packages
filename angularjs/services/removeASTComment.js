var _ = require('lodash');

/**
 * @dgService removeASTComment
 * @description
 * Removes the comment, referenced by a given doc, from the given ast.
 */
module.exports = function removeASTComment(log) {
  return function(ast, doc) {
    log.debug('removeASTComment', ast.comments.length, doc.range);
    // Remove the comment from the comments block so that the
    // extractJSDocCommentsProcessor doesn't pick it up
    _.remove(ast.comments, { range: doc.range });

  };
};
