var path = require('canonical-path');

/**
 * @dgProcessor computePath
 * @description Compute the path and outputPath for docs that do not already have them
 */
module.exports = function computePathProcessor(log) {
  return {
    $runAfter: ['docs-processed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      docs.forEach(function(doc) {

        doc.path = doc.path || doc.name || doc.codeName;

        if ( !doc.path ) {
          doc.path = path.join(path.dirname(doc.fileInfo.file));
          if ( doc.fileInfo.baseName !== 'index' ) {
            doc.path = path.join(doc.path,doc.fileInfo.baseName);
          }
        }

        if ( !doc.outputPath ) {
          doc.outputPath = path.join(doc.path + '.html');
        }

        log.silly('computed path:', '"' + doc.path + '"', 'and outputPath:', '"' + doc.outputPath + '"');
      });
    }
  };
};