var _ = require('lodash');
var parser = require('espree');

/**
 * @dgService jsdocFileReader
 * @description
 * This file reader will create a simple doc for each js
 * file including a code AST of the JavaScript in the file.
 */
module.exports = function jsdocFileReader(log) {
  return {
    name: 'jsdocFileReader',
    defaultPattern: /\.js$/,
    getDocs: function(fileInfo) {

      try {
        fileInfo.ast = parser.parse(fileInfo.content, {
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
        });
      } catch(ex) {
       ex.file = fileInfo.filePath;
        throw new Error(
          _.template('JavaScript error in file "${file}"" [line ${lineNumber}, column ${column}]: "${description}"', ex));
      }

      return [{
        docType: 'jsFile'
      }];
    }
  };
};