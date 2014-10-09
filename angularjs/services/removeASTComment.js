var _ = require('lodash');

/**
 * @dgService removeASTComment
 * @description
 * Removes the comment with the given range from the AST comments collection
 */
module.exports = function removeASTComment(log) {
  return function(ast, range) {
    log.debug('removeASTComment', ast.comments.length, range);
    // Remove the comment from the comments block so that the
    // extractJSDocCommentsProcessor doesn't pick it up
    _.remove(ast.comments, { range: range });

  };
};
