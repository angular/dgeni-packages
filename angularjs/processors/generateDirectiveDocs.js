var _ = require('lodash');

module.exports = function generateDirectiveDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(ngModule.components.directive, function(directiveDef) {

          directiveDef.docType = 'ngDirective';
          directiveDef.module = ngModule;
          directiveDef.id = _.template('${module.id}.directive:${name}')(directiveDef);
          directiveDef.parent = _.template('${module.id}.group:directive')(directiveDef);

          // TODO: extract the dependencies from the factory call
          // TODO: extract info from the directive definition object

          docs.push(directiveDef);
        });
      });

    }
  };
};