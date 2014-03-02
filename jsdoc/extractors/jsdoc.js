var _ = require('lodash');
var jsParser = require('esprima');
var LEADING_STAR = /^\s*\*[^\S\n]?/gm;

module.exports = {
  pattern: /\.js$/,
  processFile: function(filePath, contents, basePath) {

    var docFromComment = function(comment) {

      if ( comment.type === 'Block' && comment.value.charAt(0) === '*' ) {
        // We have a jsdoc comment (i.e. starting with /** ) - the parser strips off the first "/*"
        // so we are just left with a single asterisk
        
        // Strip off any leading stars
        text = comment.value.replace(LEADING_STAR, '');

        // Trim off leading and trailing whitespace
        text = text.trim();

        return {
          fileType: 'js',
          startingLine: comment.loc.start.line,
          endingLine: comment.loc.end.line,
          file: filePath,
          basePath: basePath,
          content: text
        };
      }
    };

    var ast = jsParser.parse(contents, {
      loc: true,
      comment: true
    });

    return _.map(ast.comments, docFromComment);
  }
};