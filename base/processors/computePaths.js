require('es6-shim');
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
      pathTemplateMap = new Map();
      outputPathTemplateMap = new Map();

      pathTemplates.forEach(function(template) {
        (template.docTypes || [null]).forEach(function(docType) {

          if ( template.getPath ) {
            pathTemplateMap.set(docType, template.getPath);
          } else if ( template.pathTemplate ) {
             pathTemplateMap.set(docType, _.template(template.pathTemplate));
          }

          if ( template.getOutputPath ) {
            outputPathTemplateMap.set(docType, template.getOutputPath);
          } else if ( template.outputPathTemplate ) {
             outputPathTemplateMap.set(docType, _.template(template.outputPathTemplate));
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

        if ( !doc.path ) {
          var getPath = pathTemplateMap.get(doc.docType) || pathTemplateMap.get(null);
          if ( !getPath ) {
            throw new Error(createDocMessage('Missing path template', doc));
          }
          doc.path = getPath(doc);
        }

        if ( !doc.outputPath ) {
          var getOutputPath = outputPathTemplateMap.get(doc.docType) || outputPathTemplateMap.get(null);
          if ( !getOutputPath ) {
            throw new Error(createDocMessage('Missing output path template', doc));
          }
          doc.outputPath = getOutputPath(doc);
        }

        log.silly('computed path:', '"' + doc.path + '"', 'and outputPath:', '"' + doc.outputPath + '"');
      });
    }
  };
};