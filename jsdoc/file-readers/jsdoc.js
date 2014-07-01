var _ = require('lodash');
var jsParser = require('esprima');
var walk = require('../lib/walk');
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

module.exports = {
  defaultPattern: /\.js$/,
  getDocs: function(fileInfo) {

    var ast = jsParser.parse(fileInfo.content, {
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

        // Extract the information about the code directly after this comment
        var codeNode = walk.findNodeAfter(ast, comment.range[1]);
        var codeAncestors = codeNode && walk.ancestor(ast, codeNode.node);

        // Create a doc from this comment
        return {
          startingLine: comment.loc.start.line,
          endingLine: comment.loc.end.line,
          content: text,
          codeNode: codeNode,
          codeAncestors: codeAncestors
        };

      })

      .value();
  }
};
