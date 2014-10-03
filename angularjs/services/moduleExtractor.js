var _ = require('lodash');
var SpahQL = require('spahql');

var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

module.exports = function moduleExtractor() {

  function moduleExtractorImpl(ast) {

    var rootQuery = SpahQL.db(ast);

    // We are looking for call expressions, where the callee is the `module` property on an object called `angular`
    var angularModuleCallsQuery = rootQuery
      .select("//*[/type=='CallExpression'][/callee/object/name=='angular'][/callee/property/name='module']");


    var findStatement = function(node) {
      var type;
      while(node) {
        type = node.value().type;
        if ( type === 'ExpressionStatement' ||  type === 'VariableDeclarator' ) {
          break;
        }
        node = node.parent();
      }
      return node;
    };


    var getJsDocComment = function(node) {

      var comments = node.value().leadingComments;

      if ( comments && comments.length > 0 ) {
        var comment = comments[comments.length-1];

        // We are only interested if the comment is jsdoc style: i.e. starts with "/**""
        // If so, then strip off any leading stars and trim off leading and trailing whitespace
        if ( comment.type === 'Block' && comment.value.charAt(0) == '*') {

          // Remove the comment from the comments block so that the
          // extractJSDocCommentsProcessor doesn't pick it up
          var commentRef = rootQuery.select(
            '/comments/*[/range/0 ==' + comment.range[0] + ']'+
            '[/range/1 == ' + comment.range[1] + ']');
          commentRef.destroy();

          return {
            content: comment.value.replace(LEADING_STAR, '').trim(),
            startingLine: comment.loc.start.line,
            endingLine: comment.loc.end.line
          };
        }

      }
    };


    var getModuleName = function(node) {
      // The name is the first parameter to `angular.module(name, deps)`
      return node.select('/arguments/0/value').value();
    };


    var getModuleDependencies = function(node) {
      // The dependencies are the second parameter to `angular.module(name, deps)`
      // If it doesn't exist then not only are there no dependencies but also the
      // call is not defining a new module
      if (node.assert('/arguments/1') ) {
        return node.select('/arguments/1/elements//value').values();
      }
    };

    var getRegistrations = function(moduleQuery, registrationType) {
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
    };


    var getModuleInfo = function() {

      var moduleInfo, statementQuery, statement, comment;

      statementQuery = findStatement(this);
      statement = statementQuery.value();

      moduleInfo = {
        moduleQuery: statementQuery,
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

          // Now search for all usages of this variable

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
        moduleInfo.registrations[registrationType] = getRegistrations(moduleInfo.moduleQuery, registrationType) || [];
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


