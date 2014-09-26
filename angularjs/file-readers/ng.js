var _ = require('lodash');
var jsParser = require('esprima');
var spahql = require('spahql');

var traverse = require('estraverse').traverse;
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

/**
 * @dgService ngFileReader
 * @description
 * This file reader will create a doc for each angular component
 * in each file pulling in documentation from jsdoc comments if
 * available
 */
module.exports = function ngFileReader(codeDB, log) {
  return {
    name: 'ngFileReader',
    defaultPattern: /\.js$/,
    getDocs: function(fileInfo) {

      fileInfo.ast = jsParser.parse(fileInfo.content, {
        loc: true,
        range: true,
        comment: true,
        attachComment: true
      });

      var ast = SpahQL.db(fileInfo.ast);

      var mergeModuleInfo = function(moduleDef, moduleRef) {
        if ( moduleRef.content ) {
          moduleDef.content += '\n' + moduleRef.content;
        }
      };

      var getModuleInfo = function() {
        var comment = '';
        var topLevelExpressionMatch = this.path().match(/\/body\/\d+\//);
        if ( topLevelExpressionMatch ) {
          // We have to do a bit of hacking to get the path to the comment node since the module might
          // have a number of chained method calls on it we need to look at the first expession statement
          comment = ast.select(topLevelExpressionMatch[0] + "leadingComments//value").value();

          // We are only interested if the comment is jsdoc style: i.e. starts with "/**""
          if ( comment.charAt(0) == '*' ) {
            // Strip off any leading stars and
            // Trim off leading and trailing whitespace
            comment = comment.replace(LEADING_STAR, '').trim();
          } else {
            comment = '';
          }
        }
        return {
          name: this.select('/arguments/0/value').value(),
          dependencies: this.select('/arguments/1/elements//value').values(),
          content: comment
        };
      };

      var moduleCallsQuery = ast.select("//*[/type=='CallExpression'][/callee/object/name=='angular'][/callee/property/name='module']");
      codeDB.moduleRefs = _.union(codeDB.moduleRefs, moduleCallsQuery.select('/arguments/0/value').values());

      var moduleDefsQuery = moduleCallsQuery.select('/[/arguments/.size>1]');
      var moduleDefs = moduleDefsQuery.map(getModuleInfo);
      _.forEach(moduleDefs, function(moduleDef) {
        // Store (or overwrite) the named module
        codeDB.moduleDefs[moduleDef.name] = moduleDef;
      });

      var moduleRefsQuery = moduleCallsQuery.select('/[/arguments/.size==1]');
      var moduleRefs = moduleDefsQuery.map(getModuleInfo);
      _.forEach(moduleRefs, function(moduleRef) {
        var moduleDef = _.indexOf(codeDB.meduleRefs, { name: moduleRef.name });
        if ( moduleDef ) {
          mergeModuleInfo(moduleDef, moduleRef);
        } else {
          log.warn(_.template('Module "${name}" referenced but not yet defined', moduleRef));
          moduleRef.dependencies = [];
          codeDB.moduleDefs[moduleRef.name] = moduleRef;
        }
      });
    }
  };
};