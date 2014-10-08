var _ = require('lodash');
var SpahQL = require('spahql');
var esrefactor = require('esrefactor');

module.exports = function moduleExtractor(getJsDocComment, log) {

  function moduleExtractorImpl(ast) {

    var rootQuery = SpahQL.db(ast);
    var variables = new esrefactor.Context(ast);

    // We are looking for call expressions, where the callee is the `module` property on an object called `angular`
    var angularModuleCallsQuery = rootQuery
      .select("//*[/type=='CallExpression'][/callee/object/name=='angular'][/callee/property/name='module']");


    var getModuleInfo = function() {

      var moduleInfo, statementQuery, statement, comment;

      statementQuery = findStatement(this);
      statement = statementQuery.value();

      moduleInfo = {
        moduleQuery: statementQuery,
        moduleRefs: statementQuery.clone(),
        name: getModuleName(this),
        content: '',
        startingLine: statement.loc.start.line
      };

      switch ( statement.type ) {
        case 'VariableDeclarator':

          // This call to angular is being added to a variable
          moduleInfo.variable = statement.id.name;

          // variables can have comments before the identifier ...
          comment = getJsDocComment(statement);
          // ... or before the `var` if it is the first item (i.e. index zero)
          if ( !comment && /0$/.test(statementQuery.path()) ) {
            comment = getJsDocComment(statementQuery.parent().parent().value());
          }

          // Now get all usages of this module variable
          var variableRefs = variables.identify(statement.range[0]).references;
          _.forEach(variableRefs, function(variableRef) {
            if ( variableRef.range[0] !== statement.range[0] ) {
              var query = _.template('//*[/callee/object/type == "Identifier"][/callee/object/range/0 == ${range[0]}]', variableRef);
              moduleInfo.moduleRefs = moduleInfo.moduleRefs.concat(rootQuery.select(query));
            }
          });

          break;

        case 'ExpressionStatement':
          comment = getJsDocComment(statement);
          break;
      }

      _.assign(moduleInfo, comment);

      // Add dependencies if any were defined
      var dependencies = getModuleDependencies(this);
      if ( dependencies ) {
        moduleInfo.dependencies = dependencies;
      }

      // Get info about registrations registered on the module
      moduleInfo.registrations = {};
      _.forEach(moduleExtractorImpl.registrationsToExtract, function(registrationType) {
        var registrations = [];
        moduleInfo.moduleRefs.each(function() {
           registrations = registrations.concat(getRegistrations(this, registrationType));
        });
        moduleInfo.registrations[registrationType.name] = registrations;
      });


      return moduleInfo;
    };

    return angularModuleCallsQuery.map(getModuleInfo);
  }

  moduleExtractorImpl.registrationsToExtract = [
    { name: 'controller', requiresName: true, hasFactory: true },
    { name: 'filter', requiresName: true, hasFactory: true },
    { name: 'directive', requiresName: true, hasFactory: true },
    { name: 'provider', requiresName: true, hasFactory: true },
    { name: 'factory', requiresName: true, hasFactory: true },
    { name: 'value', requiresName: true, hasFactory: false },
    { name: 'service', requiresName: true, hasFactory: true },
    { name: 'constant', requiresName: true, hasFactory: false },
    { name: 'config', requiresName: false, hasFactory: true },
    { name: 'run', requiresName: false, hasFactory: true }
  ];

  return moduleExtractorImpl;

  function getRegistrations(moduleQuery, registrationType) {
    var registrationQuery = moduleQuery.select('//callee/property[/name=="' + registrationType.name + '"]');
    var registrations = [];

    // The call chain in the AST is such that the registrations come out backwards.

    registrationQuery.each(function() {

      var query = this.parent().parent();
      var args = query.select('/arguments').value();

      var registrationInfo = {
        type: registrationType,
        astQuery: query
      };

      _.assign(registrationInfo, getJsDocComment(this.value()));

      if ( registrationType.requiresName ) {
        registrationInfo.name = args.shift().value;
      }

      if ( registrationInfo.type.hasFactory ) {
        // TODO: handle config and run blocks with multiple factory fns
        registrationInfo.dependencies = findDependencies(args.shift());
      }

      registrations.unshift(registrationInfo);
    });

    return registrations;
  }

  function findDependencies(factoryFn) {
    if ( factoryFn ) {
      // TODO: handle $inject property annotations
      switch ( factoryFn.type ) {
        case 'FunctionExpression':
          // The registration is a straight factory function
          return _.map(factoryFn.params, function(param) {
            return param.name;
          });
        case 'ArrayExpression':
          // The registration is an array annotated function
          return _(factoryFn.elements)
            .initial()
            .map(function(element) { return element.value; })
            .value();
      }
    }
  }

};


function findStatement(node) {
  var type;
  while(node) {
    type = node.value().type;
    if ( type === 'ExpressionStatement' ||  type === 'VariableDeclarator' ) {
      break;
    }
    node = node.parent();
  }
  return node;
}


function getModuleName(node) {
  // The name is the first parameter to `angular.module(name, deps)`
  return node.select('/arguments/0/value').value();
}


function getModuleDependencies(node) {
  // The dependencies are the second parameter to `angular.module(name, deps)`
  // If it doesn't exist then not only are there no dependencies but also the
  // call is not defining a new module
  if (node.assert('/arguments/1') ) {
    return node.select('/arguments/1/elements//value').values();
  }
}