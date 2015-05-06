var parser = require('espree');
var _ = require('lodash');

/**
 * @dgService jsParser
 * @description Parse code into an AST
 */
module.exports = function jsParser() {
  return {
    defaultConfig: {
      loc: true,
      attachComment: true,
      ecmaFeatures: {
        arrowFunctions: true,
        blockBindings: true,
        destructuring: true,
        regexYFlag: true,
        regexUFlag: true,
        templateStrings: true,
        binaryLiterals: true,
        octalLiterals: true,
        unicodeCodePointEscapes: true,
        defaultParams: true,
        restParams: true,
        forOf: true,
        objectLiteralComputedProperties: true,
        objectLiteralShorthandMethods: true,
        objectLiteralShorthandProperties: true,
        objectLiteralDuplicateProperties: true,
        generators: true,
        spread: true,
        classes: true,
        modules: true,
        globalReturn: true
      }
    },
    parse: function(code, config) {
      return parser.parse(code, config || this.defaultConfig);
    }
  };
}