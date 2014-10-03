var _ = require('lodash');

module.exports = function generateConstantDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['parsing-tags'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.registrations.constant, function(constantDef) {

          constantDef.docType = 'ngConstant';
          constantDef.module = ngModule;
          constantDef.id = _.template('${module.id}.constant:${name}')(constantDef);
          constantDef.parent = _.template('${module.id}.group:constant')(constantDef);

          // TODO: extract the dependencies from the factory call

          docs.push(constantDef);
        });
      });

    }
  };
};