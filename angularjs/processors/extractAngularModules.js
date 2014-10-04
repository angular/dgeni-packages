var _ = require('lodash');

module.exports = function extractAngularModulesProcessor(moduleExtractor, moduleDefs) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['extractJSDocCommentsProcessor'],
    errorOnMissingModuleDefinition: true,

    $process: function(docs) {

      var errorOnMissingModuleDefinition = this.errorOnMissingModuleDefinition;

      _.forEach(docs, function(doc) {

        if ( doc.docType === 'jsFile' ) {

          var moduleInfo = moduleExtractor(doc.fileInfo.ast);
          moduleInfo.fileInfo = doc.fileInfo;

          _.forEach(moduleInfo, function(module) {

            if ( module.dependencies ) {

              // we have defined a new module
              moduleDefs[module.name] = module;
              removeASTComment(doc.fileInfo.ast, module);

            } else {

              // we have reopened a module - find the definition
              var moduleDef = moduleDefs[module.name];

              if ( !moduleDef && errorOnMissingModuleDefinition ) {
                throw new Error('Module definition missing');
              }

              // Add the new registrations to this module definition
              _.forEach(module.registrations, function(registrations, registrationType) {
                _.forEach(registrations, function(registration) {
                  registration.fileInfo = doc.fileInfo;
                  moduleDef.registrations[registrationType].push(registration);
                  removeASTComment(doc.fileInfo.ast, registration);
                });
              });
            }
          });
        }
      });

      return docs;

    }
  };

  function removeASTComment(ast, doc) {
    // Remove the comment from the comments block so that the
    // extractJSDocCommentsProcessor doesn't pick it up
    _.remove(ast.comments, { range: doc.range });

  }
};