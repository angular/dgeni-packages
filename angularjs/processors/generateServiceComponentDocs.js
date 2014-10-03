var _ = require('lodash');

var SERVICE_TYPES = ['factory', 'value', 'service'];

module.exports = function generateServiceComponentDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['generateModuleDocsProcessor'],
    $runBefore: ['parsing-tags'],

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
            component.parent = _.template('${module.id}.group:service')(component);

            // TODO: If the component has an injectable factory then extract the dependencies

            docs.push(component);
          });
        });
      });

    }
  };
};