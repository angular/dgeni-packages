var _ = require('lodash');

module.exports = function generateProviderDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['parsing-tags'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.registrations.provider, function(providerDef) {

          providerDef.docType = 'ngProvider';
          providerDef.module = ngModule;
          providerDef.service = _.template('${module.id}.service:${name}')(providerDef);
          providerDef.name = providerDef.name + 'Provider';
          providerDef.id = _.template('${module.id}.provider:${name}')(providerDef);
          providerDef.parent = _.template('${module.id}.group:provider')(providerDef);

          // TODO: extract the dependencies from the factory call
          // TODO: generate service doc from the $get method

          docs.push(providerDef);
        });
      });

    }
  };
};