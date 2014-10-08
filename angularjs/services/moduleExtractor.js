var _ = require('lodash');
var SpahQL = require('spahql');
var esrefactor = require('esrefactor');

var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

module.exports = function moduleExtractor() {

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
          comment = getJsDocComment(statementQuery);
          // ... or before the `var` if it is the first item (i.e. index zero)
          if ( !comment && /0$/.test(statementQuery.path()) ) {
            comment = getJsDocComment(statementQuery.parent().parent());
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
          comment = getJsDocComment(statementQuery);
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
        moduleInfo.registrations[registrationType] = registrations;
      });


      return moduleInfo;
    };

    return angularModuleCallsQuery.map(getModuleInfo);
  }

  moduleExtractorImpl.registrationsToExtract = [
    'controller',
    'filter',
    'directive',
    'provider',
    'factory',
    'value',
    'service',
    'constant',
    'config',
    'run'
  ];

  return moduleExtractorImpl;
};

function getRegistrations(moduleQuery, registrationType) {
  var registrationQuery = moduleQuery.select('//callee/property[/name=="' + registrationType + '"]');
  var registrations = [];

  // The call chain in the AST is such that the registrations come out backwards.

  registrationQuery.each(function() {
    var registrationName = this.parent().parent().select('/arguments/0/value').value();
    var registrationInfo = {
      type: registrationType,
      name: registrationName
    };

    _.assign(registrationInfo, getJsDocComment(this));
    registrations.unshift(registrationInfo);
  });

  return registrations;
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


function getJsDocComment(node) {

  var comments = node.value().leadingComments;

  if ( comments && comments.length > 0 ) {
    var comment = comments[comments.length-1];

    // We are only interested if the comment is jsdoc style: i.e. starts with "/**""
    // If so, then strip off any leading stars and trim off leading and trailing whitespace
    if ( comment.type === 'Block' && comment.value.charAt(0) == '*') {

      return {
        content: comment.value.replace(LEADING_STAR, '').trim(),
        startingLine: comment.loc.start.line,
        endingLine: comment.loc.end.line,
        range: comment.range
      };
    }

  }
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