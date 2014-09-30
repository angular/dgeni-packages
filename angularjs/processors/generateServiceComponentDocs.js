var _ = require('lodash');

var SERVICE_TYPES = ['factory', 'value', 'service', 'constant'];

module.exports = function generateServiceComponentDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {

      _(docs)
      .filter({docType: 'ngModule'})
      .forEach(function(ngModule) {
        _.forEach(SERVICE_TYPES, function(serviceType) {
          _.forEach(ngModule.components[serviceType], function(component) {
            component.docType = 'ngService';
            component.serviceType = serviceType;
            component.module = ngModule;
            component.id = _.template('${module.id}.service:${name}')(component);
            component.parent = _.template('${module.id}.group:${serviceType}')(component);
            docs.push(component);
          });
        });
      });

    }
  };
};