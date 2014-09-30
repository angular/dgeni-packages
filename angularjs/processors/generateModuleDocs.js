var _ = require('lodash');

module.exports = function generateModuleDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {

      _.forEach(moduleDefs, function(moduleDef) {
        moduleDef.docType = 'ngModule';
        moduleDef.id = 'module:' + moduleDef.name;
        docs.push(moduleDef);
      });

    }
  };
};