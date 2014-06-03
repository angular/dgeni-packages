var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor computePath
 * @description Compute the path and outputPath for docs that do not already have them
 */
module.exports = function computePathProcessor() {
  return {
    $runAfter: ['docs-processed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {

      var contentsFolder = config.get('rendering.contentsFolder');
      if ( !contentsFolder ) {
        throw new Error('Invalid configuration. You must provide config.rendering.contentsFolder');
      }

      _.forEach(docs, function(doc) {
        doc.path = doc.path || doc.name || doc.codeName;

        if ( !doc.path ) {
          doc.path = path.join(path.dirname(doc.file));
          if ( doc.fileName !== 'index' ) {
            doc.path += '/' + doc.fileName;
          }
        }

        if ( !doc.outputPath ) {
          doc.outputPath = contentsFolder + '/' + doc.path + '.html';
        }
      });
    }
  };
};