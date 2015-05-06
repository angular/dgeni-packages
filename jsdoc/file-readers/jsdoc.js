var _ = require('lodash');
var espree = require('espree');
// exported so we can use them in tests
var parserOptions = exports.parserOptions = {
    comment: true,
    loc: true,
    range: true,
    tokens: true,
    ecmaFeatures: {
        arrowFunctions: true,
        binaryLiterals: true,
        blockBindings: true,
        classes: true,
        defaultParams: true,
        destructuring: true,
        forOf: true,
        generators: true,
        globalReturn: true,
        jsx: false,
        modules: true,
        objectLiteralComputedProperties: true,
        objectLiteralDuplicateProperties: true,
        objectLiteralShorthandMethods: true,
        objectLiteralShorthandProperties: true,
        octalLiterals: true,
        regexUFlag: true,
        regexYFlag: true,
        restParams: true,
        spread: true,
        superInFunctions: true,
        templateStrings: true,
        unicodeCodePointEscapes: true
    }
};

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
        fileInfo.ast = espree.parse(fileInfo.content, parserOptions);
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