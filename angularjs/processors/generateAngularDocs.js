var _ = require('lodash');

module.exports = function generateAngularDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['processing-docs'],

    $process: function(docs) {
      var processor = this;
      var componentTypeInfo = this.componentTypeInfo;

      // Now create docs for each component that was registered to a module
      _.forEach(componentTypeInfo, function(componentTypeInfo, componentType) {

        _.forEach(moduleDefs, function(moduleDef) {

          _.forEach(moduleDef.components, function(componentDef) {

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

      });
    }
  };
};