var _ = require('lodash');

module.exports = function generateControllerDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['parsing-tags'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.components.controller, function(controllerDef) {

          controllerDef.docType = 'ngController';
          controllerDef.module = ngModule;
          controllerDef.id = _.template('${module.id}.controller:${name}')(controllerDef);
          controllerDef.parent = _.template('${module.id}.group:controller')(controllerDef);

          // TODO: extract the dependencies from the factory call

          docs.push(controllerDef);
        });
      });

    }
  };
};