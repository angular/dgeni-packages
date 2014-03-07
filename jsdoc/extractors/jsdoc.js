var _ = require('lodash');
var jsParser = require('esprima');
var LEADING_STAR = /^\s*\*[^\S\n]?/gm;

module.exports = {
  pattern: /\.js$/,
  processFile: function(filePath, contents, basePath) {

    var ast = jsParser.parse(contents, {
      loc: true,
      range: true,
      comment: true
    });

    return _(ast.comments)

      .filter(function(comment) {
        // To test for a jsdoc comment (i.e. starting with /** ), we need to check for a leading
        // star since the parser strips off the first "/*"        
        return comment.type === 'Block' && comment.value.charAt(0) === '*';
      })

      .map(function(comment) {

        // Strip off any leading stars
        text = comment.value.replace(LEADING_STAR, '');

        // Trim off leading and trailing whitespace
        text = text.trim();

        // Create a doc from this comment
        return {
          fileType: 'js',
          startingLine: comment.loc.start.line,
          endingLine: comment.loc.end.line,
          file: filePath,
          basePath: basePath,
          content: text
        };

      })

      .value();
  }
};