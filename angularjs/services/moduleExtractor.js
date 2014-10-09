var _ = require('lodash');
var SpahQL = require('spahql');
var esrefactor = require('esrefactor');

module.exports = function moduleExtractor(moduleRegistrationTypes, getJsDocComment, log) {

  return function moduleExtractorImpl(ast) {

    var rootQuery, variableLookup;

    rootQuery = SpahQL.db(ast);
    variableLookup = new esrefactor.Context(ast);

    // We are looking for call expressions, where the callee is the `module` property on an object called `angular`
    var angularModuleCallsQuery = rootQuery
      .select("//*[/type=='CallExpression'][/callee/object/name=='angular'][/callee/property/name='module']");

    return angularModuleCallsQuery.map(function() {
      var moduleInfo = getModuleInfo(this, rootQuery, variableLookup);

      // Add dependencies if any were defined
      var dependencies = getModuleDependencies(moduleInfo.moduleQuery);
      if ( dependencies ) {
        moduleInfo.dependencies = dependencies;
      }

      // Get info about registrations registered on the module
      moduleInfo.registrations = {};
      _.forEach(moduleRegistrationTypes, function(registrationType) {
        var registrations = [];
        moduleInfo.moduleRefsQuery.each(function() {
           registrations = registrations.concat(getRegistrations(this, registrationType));
        });
        moduleInfo.registrations[registrationType.name] = registrations;
      });

      return moduleInfo;

    });
  };



  function getModuleInfo(moduleQuery, rootQuery, variableLookup) {

    var moduleInfo, statementQuery, statement, comment;

    statementQuery = findStatement(moduleQuery);
    statement = statementQuery.value();

    moduleInfo = {
      moduleQuery: moduleQuery,
      moduleRefsQuery: statementQuery.clone(),
      name: getModuleName(moduleQuery),
      content: '',
      startingLine: statement.loc.start.line
    };

    if ( statement.type === 'VariableDeclarator' ) {
      moduleInfo.variable = statement.id.name;
    }

    comment = getJsDocComment(statement);

    if ( moduleInfo.variable ) {

      if ( !comment && /0$/.test(statementQuery.path()) ) {
        // variables can have comments before the identifier ...
        // ... or before the `var` if it is the first item (i.e. index zero)
        comment = getJsDocComment(statementQuery.parent().parent().value());
      }

      // get all usages of this module variable
      var variableRefs = variableLookup.identify(statement.range[0]).references;

      _.forEach(variableRefs, function(variableRef) {

        // Exclude the original declaration
        if ( variableRef.range[0] !== statement.range[0] ) {
          // Create a new query for each use of the module variable
          var query = _.template('//*[/callee/object/type == "Identifier"][/callee/object/range/0 == ${range[0]}]', variableRef);
          // and add it to the moduleRefsQuery query for later
          moduleInfo.moduleRefsQuery = moduleInfo.moduleRefsQuery.concat(rootQuery.select(query));
        }
      });
    }

    _.assign(moduleInfo, comment);

    return moduleInfo;
  }


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

};