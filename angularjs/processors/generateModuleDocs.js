var _ = require('lodash');

module.exports = function generateModuleDocsProcessor(moduleDefs, removeASTComment) {
  return {
    $runAfter: ['extractAngularModulesProcessor'],
    $runBefore: ['extractJSDocCommentsProcessor'],

    $process: function(docs) {

      _.forEach(moduleDefs, function(moduleDef) {

        moduleDef.docType = 'ngModule';
        moduleDef.id = _.template('module:${name}')(moduleDef);
        moduleDef.groups = {};
        removeASTComment(moduleDef.fileInfo.ast, moduleDef);
        docs.push(moduleDef);

        // Also create a doc for holding each type of component in the module
        _.forEach(moduleDef.registrations, function(registrations, registrationType) {

          if ( registrations.length > 0 ) {

            _.forEach(registrations, function(registration) {

              var componentGroup = moduleDef.groups[registrationType.group];
              if ( !componentGroup ) {
                componentGroup = createComponentGroup(registration.type, moduleDef);
                docs.push(componentGroup);
              }

              var doc = getRegistrationDoc(registrationType, registration, componentGroup);
              removeASTComment(moduleDef.fileInfo.ast, doc);
              docs.push(doc);
            });
          }
        });

      });

    }
  };
};

function createComponentGroup(registrationType, moduleDef) {

  var group = {
    docType: 'componentGroup',
    name: registrationType.plural,
    title: registrationType.title,
    module: moduleDef,
    parent: moduleDef,
    children: []
  };

  group.id = _.template('${module.id}.${name}')(group);
  moduleDef.groups[registrationType.group] = group;

  return group;
}


function getRegistrationDoc(regType, regInfo, group) {

  regInfo.regType = regType;
  regInfo.docType = regType.docType;
  regInfo.module = group.module;
  regInfo.parent = regInfo.group = group;

  group.children.push(regInfo);

  regInfo.id = _.template('${module.id}.${regType.group}:${name}')(regInfo);

  return regInfo;
}