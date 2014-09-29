var _ = require('lodash');

module.exports = function generateModuleDocs(moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {
      var processor = this;
      var componentTypeInfo = this.componentTypeInfo;

      _.forEach(moduleDefs, function(moduleDef) {

        // Add a doc for each module
        docs.push(moduleDef);
      });

      return docs;
    }
  };
};