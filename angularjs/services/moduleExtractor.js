var _ = require('lodash');

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

    var getComponents = function(moduleQuery, componentType) {
      var componentQuery = moduleQuery.select('//callee/property[/name=="' + componentType + '"]');
      // console.log(componentQuery);
      var components = [];

      // The call chain in the AST is such that the components come out backwards.

      componentQuery.each(function() {
        var componentName = this.parent().parent().select('/arguments/0/value').value();
        var componentInfo = {
          type: componentType,
          name: componentName
        };
        _.assign(componentInfo, getJsDocComment(this));
        components.unshift(componentInfo);
      });

      console.log(components);
      return components;
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

      // Get info about components registered on the module
      moduleInfo.components = {};
      _.forEach(moduleExtractorImpl.componentsToExtract, function(componentType) {
        moduleInfo.components[componentType] = getComponents(moduleInfo.moduleQuery, componentType) || [];
      });


      return moduleInfo;
    };

    return angularModuleCallsQuery.map(getModuleInfo);
  }

  moduleExtractorImpl.componentsToExtract = [
    'controller',
    'filter',
    'directive',
    'provider',
    'factory',
    'value',
    'service'
  ];

  return moduleExtractorImpl;
};


