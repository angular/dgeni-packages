var path = require('canonical-path');

/**
 * @dgService computePathProcessor
 * @description
 * Compute the path and outputPath for docs that do not already have them
 */
module.exports = function computePathProcessor(apiDocsProcessor) {
  return {
    $runAfter: ['docs-processed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      docs.forEach(function(doc) {

        if ( !doc.path ) {
          doc.path = path.join(path.dirname(doc.fileInfo.file));
          if ( doc.fileInfo.baseName !== 'index' ) {
            doc.path += '/' + doc.fileInfo.baseName;
          }
        }

        if ( !doc.outputPath ) {
          doc.outputPath = apiDocsProcessor.apiDocsPath + '/' + doc.path + '.html';
        }
      });
    }
  };
};