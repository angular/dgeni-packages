var _ = require('lodash');

module.exports = function extractAngularModulesProcessor(moduleExtractor) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['extractJSDocComments'],
    errorOnMissingModuleDefinition: true,

    $process: function(docs) {

      var errorOnMissingModuleDefinition = this.errorOnMissingModuleDefinition;

      docs = _.filter(docs, function(doc) {

        if ( doc.docType != 'jsFile' ) {
          return doc;
        }

        var moduleInfo = moduleExtractor(doc.fileInfo.ast);
        moduleInfo.fileInfo = fileInfo;

        _.forEach(moduleInfo, function(module) {

          if ( module.dependencies ) {

            // we have defined a new module
            moduleDefs[module.name] = module;

          } else {

            // we have reopened a module - find the definition
            var moduleDef = moduleDefs[module.name];

            if ( !moduleDef && errorOnMissingModuleDefinition ) {
              throw new Error('Module definition missing');
            }

            // Add the new components to this module definition
            _.forEach(module.components, function(components, componentType) {
              _.forEach(components, function(component) {
                component.fileInfo = fileInfo;
                moduleDef.components[componentType].push(component);
              });
            });
          }
        });
      });

      return docs;

    }
  };
};