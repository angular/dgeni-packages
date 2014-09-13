var _ = require('lodash');
var jsParser = require('esprima');
var traverse = require('estraverse').traverse;
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

/**
 * @dgService jsdocFileReader
 * @description
 * This file reader will pull a doc for each jsdoc style comment in the source file
 * (by default .js)
 *
 * The doc will initially have the form:
 * ```
 * {
 *   content: 'the content of the comment',
 *   startingLine: xxx,
 *   endingLine: xxx,
 *   codeNode: someASTNode
 *   codeAncestors: arrayOfASTNodes
 * }
 * ```
 */
module.exports = function jsdocFileReader() {
  return {
    name: 'jsdocFileReader',
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
          var codeNode = findNodeAfter(ast, comment.range[1]);

          // Create a doc from this comment
          return {
            startingLine: comment.loc.start.line,
            endingLine: comment.loc.end.line,
            content: text,
            codeNode: codeNode.node,
            codeAncestors: codeNode.path,
            docType: 'js'
          };

        })

        .value();
    }
  };
};

function findNodeAfter(ast, pos) {
  var found, path;
  traverse(ast, {
    enter: function(node) {
      if ( node.range[1] > pos && node.range[0] >= pos ) {
        if ( !found || found.range[0] >= node.range[0] ) {
          found = node;
          path = this.parents();
          this.skip();
        }
      }
    }
  });
  return { node: found, path: path };
}