var _ = require('lodash');

module.exports = function generateFilterDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.components.filter, function(filterDef) {

          filterDef.docType = 'ngFilter';
          filterDef.module = ngModule;
          filterDef.id = _.template('${module.id}.filter:${name}')(filterDef);
          filterDef.parent = _.template('${module.id}.group:filter')(filterDef);

          // TODO: extract the dependencies from the factory call

          docs.push(filterDef);
        });
      });

    }
  };
};