var _ = require('lodash');
var SpahQL = require('spahql');
var esrefactor = require('esrefactor');

module.exports = function getModuleInfo(moduleRegistrationTypes, getJsDocComment, log) {

  return function getModuleInfoImpl(ast) {

    var rootQuery, variableLookup;

    rootQuery = SpahQL.db(ast);
    variableLookup = new esrefactor.Context(ast);

    // We are looking for call expressions, where the callee is the `module` property on an object called `angular`
    var angularModuleCallsQuery = getCallsTo('angular', 'module');

    return angularModuleCallsQuery.map(function() {
      var moduleInfo = parseModuleCall(this);

      // Add module dependencies if any were defined
      var dependencies = getModuleDependencies(moduleInfo.moduleQuery);
      if ( dependencies ) {
        moduleInfo.dependencies = dependencies;
      }

      // Get info about registrations on the module
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

    function parseModuleCall(moduleQuery) {

      var moduleInfo, statementQuery, statement, comment;

      statementQuery = findStatement(moduleQuery);
      statement = statementQuery.value();

      moduleInfo = {
        moduleQuery: moduleQuery,
        moduleRefsQuery: statementQuery.clone(),
        name: getParameter(moduleQuery, 0),
        content: '',
        startingLine: statement.loc.start.line
      };

      if ( statement.type === 'VariableDeclarator' ) {
        moduleInfo.variable = statement.id.name;
      }

      comment = getJsDocComment(statement, rootQuery.sourceData());

      if ( moduleInfo.variable ) {

        if ( !comment && /0$/.test(statementQuery.path()) ) {
          // variables can have comments before the identifier ...
          // ... or before the `var` if it is the first item (i.e. index zero)
          comment = getJsDocComment(statementQuery.parent().parent().value(), rootQuery.sourceData());
        }

        // get all usages of this module variable
        _.forEach(getReferences(statement), function(reference) {
          moduleInfo.moduleRefsQuery = moduleInfo.moduleRefsQuery.concat(reference);
        });

      }

      // Attach the comment properties to the moduleInfo
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

        _.assign(registrationInfo, getJsDocComment(this.value(), rootQuery.sourceData()));

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


    function getCallsTo(object, method) {
      var objectName = _.isString(object) ? object : null;
      var baseQuery = _.isObject(object) ? object : rootQuery;

      var queryString = "//*[/type=='CallExpression']";
      var query = baseQuery.select(queryString);

      if ( method ) {
        query = query.filter("/callee/property/name=='" + method + "'");
      }

      if ( objectName ) {
        query = query.filter("/callee/object/name=='"+objectName+"'");
      }

      return query;
    }


    function getDeclaration(variableRef) {
      // We have found a variable rather than a declaration of a node
      // so let's look for the declaration too.
      var declaration = variableLookup.identify(variableRef.range[0]).declaration;
      return getNodeAt(declaration.range);
    }

    function getReferences(variableDeclaration) {
      var variableRefNodes = [];

      // get all usages of this module variable
      var variableRefs = variableLookup.identify(variableDeclaration.range[0]).references;

      _.forEach(variableRefs, function(variableRef) {

        // Exclude the original declaration
        if ( variableRef.range[0] !== variableDeclaration.range[0] ) {
          variableRefNodes.push(getNodeAt(variableRef.range));
        }
      });

      return variableRefNodes;
    }

    function getNodeAt(range) {
      var query = _.template('//*[/callee/object/type == "Identifier"][/callee/object/range/0 == ${range[0]}]', {range : range});
      return rootQuery.select(query);
    }
  };

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


  function getParameter(node, index) {
    // The name is the first parameter to `angular.module(name, deps)`
    return node.select('/arguments/'+index+'/value').value();
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