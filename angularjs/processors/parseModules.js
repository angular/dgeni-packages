var _ = require('lodash');

module.exports = function parseModulesProcessor(getModuleInfo, moduleDefs, log) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['extractJSDocCommentsProcessor'],
    errorOnMissingModuleDefinition: true,

    $process: function(docs) {

      var errorOnMissingModuleDefinition = this.errorOnMissingModuleDefinition;

      _.forEach(docs, function(doc) {

        if ( doc.docType === 'jsFile' ) {

          log.debug('reading jsfile', doc.fileInfo.projectRelativePath);

          var moduleInfo = getModuleInfo(doc.fileInfo.ast);

          _.forEach(moduleInfo, function(module) {

            log.debug('extracted module', module.name);

            if ( module.dependencies ) {

              // we have defined a new module
              module.fileInfo = doc.fileInfo;
              moduleDefs[module.name] = module;

            } else {

              // we have reopened a module - find the definition
              var moduleDef = moduleDefs[module.name];

              if ( !moduleDef && errorOnMissingModuleDefinition ) {
                throw new Error('Module definition missing for "' + module.name + '" in "' + doc.fileInfo.filePath);
              }

              // Add the new registrations to this module definition
              _.forEach(module.registrations, function(registrations, registrationType) {
                _.forEach(registrations, function(registration) {
                  registration.fileInfo = doc.fileInfo;
                  moduleDef.registrations[registrationType].push(registration);
                });
              });
            }
          });
        }
      });

      return docs;

    }
  };
};