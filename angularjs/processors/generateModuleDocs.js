var _ = require('lodash');

module.exports = function generateModuleDocsProcessor(moduleDefs) {
  return {
    $runAfter: ['parseModulesProcessor'],
    $runBefore: ['extractJSDocCommentsProcessor'],

    $process: function(docs) {

      _.forEach(moduleDefs, function(moduleDef) {

        moduleDef.docType = 'ngModule';
        moduleDef.id = _.template('module:${name}')(moduleDef);
        moduleDef.groups = {};

        moduleDef.dependencies = _.map(moduleDef.dependencies, function(dep) {
          if ( _.isString(dep) ) {
            return moduleDefs[dep];
          } else {
            return dep;
          }
        });
        docs.push(moduleDef);

        // Also create a doc for holding each type of component in the module
        _.forEach(moduleDef.registrations, function(registrations) {

          if ( registrations.length > 0 ) {

            _.forEach(registrations, function(registration) {

              var componentGroup = moduleDef.groups[registration.type.group];
              if ( !componentGroup ) {
                componentGroup = createComponentGroup(registration.type, moduleDef);
                docs.push(componentGroup);
              }

              var doc = getRegistrationDoc(registration.type, registration, componentGroup);
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