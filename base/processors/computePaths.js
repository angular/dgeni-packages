const templateFn = require('lodash.template');

/**
 * @dgProcessor computePathsProcessor
 * @description Compute the path and outputPath for docs that do not already have them from a set of templates
 */
module.exports = function computePathsProcessor(log, createDocMessage) {
  function initializeMaps(pathTemplates) {
    const pathTemplateMap = new Map();
    const outputPathTemplateMap = new Map();

    pathTemplates.forEach(template => {
      if ( template.docTypes ) {
        template.docTypes.forEach(docType => {

          if ( template.getPath ) {
            pathTemplateMap[docType] = template.getPath;
          } else if ( template.pathTemplate ) {
             pathTemplateMap[docType] = templateFn(template.pathTemplate);
          }

          if ( template.getOutputPath ) {
            outputPathTemplateMap[docType] = template.getOutputPath;
          } else if ( template.outputPathTemplate ) {
             outputPathTemplateMap[docType] = templateFn(template.outputPathTemplate);
          }
        });
      }
    });
    return {pathTemplateMap, outputPathTemplateMap};
  }

  return {
    $validate: {
      pathTemplates: { presence: true }
    },
    pathTemplates: [],
    $runAfter: ['computing-paths'],
    $runBefore: ['paths-computed'],
    $process(docs) {

      const {pathTemplateMap, outputPathTemplateMap} = initializeMaps(this.pathTemplates);

      docs.forEach(doc => {

        try {

          if ( !doc.path ) {
            const getPath = pathTemplateMap[doc.docType];
            if ( !getPath ) {
              log.warn(createDocMessage('No path template provided', doc));
            } else {
              doc.path = getPath(doc);
            }
          }

          if ( !doc.outputPath ) {
            const getOutputPath = outputPathTemplateMap[doc.docType];
            if ( !getOutputPath ) {
              log.warn(createDocMessage('No output path template provided', doc));
            } else {
              doc.outputPath = getOutputPath(doc);
            }
          }

        } catch(err) {
          throw new Error(createDocMessage('Failed to compute paths for doc', doc, err));
        }

        log.debug(createDocMessage('path: ' + doc.path + '; outputPath: ' + doc.outputPath, doc));
      });
    }
  };
};
