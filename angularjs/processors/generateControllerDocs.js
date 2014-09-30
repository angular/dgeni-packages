var _ = require('lodash');

module.exports = function generateControllerDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.components.controller, function(controllerDef) {
          controllerDef.docType = 'ngController';
          controllerDef.module = ngModule;
          controllerDef.id = _.template('${module.id}.controller:${name}')(controllerDef);
          docs.push(controllerDef);
        });
      });

    }
  };
};