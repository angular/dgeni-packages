var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor computePathsProcessor
 * @description Compute the path and outputPath for docs that do not already have them from a set of templates
 */
module.exports = function computePathsProcessor(log, createDocMessage) {
  var pathTemplateMap, outputPathTemplateMap;

  var initializeMaps = function(pathTemplates) {
    if ( !pathTemplateMap || !outputPathTemplateMap ) {
      pathTemplateMap = {};
      outputPathTemplateMap = {};

      pathTemplates.forEach(function(template) {
        (template.docTypes || [null]).forEach(function(docType) {

          if ( template.getPath ) {
            pathTemplateMap[docType] = template.getPath;
          } else if ( template.pathTemplate ) {
             pathTemplateMap[docType] = _.template(template.pathTemplate);
          }

          if ( template.getOutputPath ) {
            outputPathTemplateMap[docType] = template.getOutputPath;
          } else if ( template.outputPathTemplate ) {
             outputPathTemplateMap[docType] = _.template(template.outputPathTemplate);
          }
        });
      });
    }
  };

  return {
    $validate: {
      pathTemplates: { presence: true }
    },
    pathTemplates: [],
    $runAfter: ['computing-paths'],
    $runBefore: ['paths-computed'],
    $process: function(docs) {

      initializeMaps(this.pathTemplates);

      docs.forEach(function(doc) {

        try {

          if ( !doc.path ) {
            var getPath = pathTemplateMap[doc.docType] || pathTemplateMap[null];
            if ( !getPath ) {
              throw new Error(createDocMessage('Missing path template', doc));
            }
            doc.path = getPath(doc);
          }

          if ( !doc.outputPath ) {
            var getOutputPath = outputPathTemplateMap[doc.docType] || outputPathTemplateMap[null];
            if ( !getOutputPath ) {
              throw new Error(createDocMessage('Missing output path template', doc));
            }
            doc.outputPath = getOutputPath(doc);
          }

        } catch(err) {
          throw new Error(createDocMessage('Failed to compute paths for doc', doc, err));
        }

        log.debug('computed path for:', '"' + doc.id + '" (' + doc.docType + ') - "' + doc.path + '"', 'and outputPath:', '"' + doc.outputPath + '"');
      });
    }
  };
};