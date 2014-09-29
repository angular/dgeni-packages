var _ = require('lodash');

module.exports = function generateAngularDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['processing-docs'],
    $validate: {
      componentTypeMap: { presence: true }
    },
    componentTypeInfo: {
      'provider': { template: _.template('${name}Provider') },
      'service': { template: _.template('${name}') },
      'factory': { template: _.template('${name}') },
      'value': { template: _.template('${name}') },
      'constant': { template: _.template('${name}') },
      'filter': { template: _.template('${name}Filter') },
      'directive': { template: _.template('${name}') },
      'controller': { template: _.template('${name}') }
    },
    $process: function(docs) {
      var processor = this;
      var componentTypeInfo = this.componentTypeInfo;

      // Add a doc for each module
      _.forEach(moduleDefs, function(moduleDef) {
        docs.push(moduleDef);
      });

      // Now create docs for each component that was registered to a module
      _.forEach(componentTypeInfo, function(componentTypeInfo, componentType) {
        var container = {};
        containers[componentTypeInfo.container] = container;

        _.forEach(moduleDefs, function(moduleDef) {

          _.forEach(moduleDef.components, function(componentDef) {

            componentDef.injectableName = componentTypeInfo.template(componentDef);
            component.fileInfo = component.fileInfo || moduleDef.fileInfo;
            component.module = moduleDef;

            if ( componentTypeInfo.unique ) {
              container[componentDef.injectableName] = componentDef;
            } else {
              var items = container[componentDef.injectableName] || [];
              items.push(componentDef);
              container[componentDef.injectableName] = items;
            }
          });
        });

        _.forEach(containers, function(container, containerType) {
          _.forEach()
          docs.push()
        });
      });
    }
  };
};