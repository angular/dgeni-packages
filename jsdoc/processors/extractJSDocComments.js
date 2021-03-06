const traverse = require('estraverse').traverse;
const LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

/**
 * @dgProcessor extractJSDocCommentsProcessor
 * @description
 * This processor will create a doc for each jsdoc style comment in each jsFile
 * doc in the docs collection.
 *
 * It will optionaly remove those jsFile docs from the collection by setting the
 * `removeJsFileDocs` property.
 *
 * The doc will initially have the form:
 * ```
 * {
 *   fileInfo: { ... },
 *   content: 'the content of the comment',
 *   startingLine: xxx,
 *   endingLine: xxx,
 *   codeNode: someASTNode
 *   codeAncestors: arrayOfASTNodes
 * }
 * ```
 */
module.exports = function extractJSDocCommentsProcessor() {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $validate: {
      removeJsFileDocs: { presence: true }
    },
    removeJsFileDocs: true,
    $process(docs) {

      const commentDocs = [];
      const processor = this;

      // Extract all the `jsFile` docs from the docs collection
      docs = docs.filter(doc => {

        if ( doc.docType !== 'jsFile' ) {
          return true;
        }

        // Generate a doc for each jsdoc style comment
        doc.fileInfo.ast.comments.forEach(comment => {

          // To test for a jsdoc comment (i.e. starting with /** ), we need to check for a
          // star in the first character since the parser strips off the "/*" comment identifier
          if ( comment.type === 'Block' && comment.value.charAt(0) === '*' ) {
            // Strip off any leading stars and
            // trim off leading and trailing whitespace
            const text = comment.value.replace(LEADING_STAR, '').trim();

            // Extract the information about the code directly after this comment
            const codeLocation = findNodeAfter(doc.fileInfo.ast, comment.range[1]);

            // Create a doc from this comment
            commentDocs.push({
              fileInfo: doc.fileInfo,
              startingLine: comment.loc.start.line,
              endingLine: comment.loc.end.line,
              content: text,
              codeNode: codeLocation.node,
              codeAncestors: codeLocation.path,
              docType: 'js'
            });
          }
        });
        return !processor.removeJsFileDocs;
      });

      // Add the new comment docs to the docs collection
      return docs.concat(commentDocs);
    }
  };
};

function findNodeAfter(ast, pos) {
  let found, path;
  traverse(ast, {
    enter(node) {
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