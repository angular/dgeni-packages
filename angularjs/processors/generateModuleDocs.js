var _ = require('lodash');

module.exports = function generateModuleDocsProcessor(moduleDefs, removeASTComment) {
  return {
    $runAfter: ['extractAngularModulesProcessor'],
    $runBefore: ['extractJSDocCommentsProcessor'],

    $validate: {
      registrationTypes: { presence: true }
    },

    registrationTypes: [
      { registration: 'constant', group: 'constant', title: 'Constants', plural: 'constants', docType: 'ngConstant' },
      { registration: 'controller', group: 'controller', title: 'Controllers', plural: 'controllers', docType: 'ngController', extras: [getInjectableDependencies] },
      { registration: 'directive', group: 'directive', title: 'Directives', plural: 'directives', docType: 'ngDirective', extras: [getInjectableDependencies, parseDirectiveDefinition] },
      { registration: 'filter', group: 'filter', title: 'Filters', plural: 'filters', docType: 'ngFilter', extras: [getInjectableDependencies] },
      { registration: 'provider', group: 'provider', title: 'Providers', plural: 'providers', docType: 'ngProvider', extras: [getInjectableDependencies] },
      { registration: 'factory', group: 'service', title: 'Services', plural: 'services', docType: 'ngService', extras: [getInjectableDependencies] },
      { registration: 'service', group: 'service', title: 'Services', plural: 'services', docType: 'ngService', extras: [getInjectableDependencies] },
      { registration: 'value', group: 'service', title: 'Services', plural: 'services', docType: 'ngService', extras: [getInjectableDependencies] }
    ],

    $process: function(docs) {

      var registrationTypes = this.registrationTypes;

      _.forEach(moduleDefs, function(moduleDef) {

        moduleDef.docType = 'ngModule';
        moduleDef.id = _.template('module:${name}')(moduleDef);
        moduleDef.groups = {};
        removeASTComment(moduleDef.fileInfo.ast, moduleDef);
        docs.push(moduleDef);

        // Also create a doc for holding each type of component in the module
        _.forEach(registrationTypes, function(registrationType) {
          var registrations = moduleDef.registrations &&
                              moduleDef.registrations[registrationType.registration];

          if ( registrations && registrations.length > 0 ) {

            var componentGroup = getComponentGroup(registrationType, moduleDef);
            docs.push(componentGroup);

            _.forEach(registrations, function(registration) {

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

function getComponentGroup(registrationType, moduleDef) {

  var group = moduleDef.groups[registrationType.group];
  if ( !group ) {
    group = {
      docType: 'componentGroup',
      name: registrationType.plural,
      title: registrationType.title,
      module: moduleDef,
      parent: moduleDef,
      children: []
    };
    group.id = _.template('${module.id}.group:${name}')(group);
    moduleDef.groups[registrationType.group] = group;
  }
  return group;
}


function getRegistrationDoc(regType, regInfo, group) {

  regInfo.regType = regType;
  regInfo.docType = regType.docType;
  regInfo.module = group.module;
  regInfo.parent = regInfo.group = group;

  group.children.push(regInfo);

  // Run any extra processing for this regType
  _.forEach(regType.extras, function(extra) {
    extra(regInfo);
  });

  regInfo.id = _.template('${module.id}.${regType.group}:${name}')(regInfo);

  return regInfo;
}

function getInjectableDependencies(doc) {

}

function parseDirectiveDefinition(doc) {

}
