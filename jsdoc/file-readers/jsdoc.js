var _ = require('lodash');
var espree = require('espree');

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
        fileInfo.ast = espree.parse(fileInfo.content, {
          loc: true,
          attachComment: true,
          // specify parsing features (default only has blockBindings: true)
          // setting this option replaces the default values
          ecmaFeatures: {
            // enable parsing of arrow functions
            arrowFunctions: true,

            // enable parsing of let/const
            blockBindings: true,

            // enable parsing of destructured arrays and objects
            destructuring: true,

            // enable parsing of regular expression y flag
            regexYFlag: true,

            // enable parsing of regular expression u flag
            regexUFlag: true,

            // enable parsing of template strings
            templateStrings: true,

            // enable parsing of binary literals
            binaryLiterals: true,

            // enable parsing of ES6 octal literals
            octalLiterals: true,

            // enable parsing unicode code point escape sequences
            unicodeCodePointEscapes: true,

            // enable parsing of default parameters
            defaultParams: true,

            // enable parsing of rest parameters
            restParams: true,

            // enable parsing of for-of statement
            forOf: true,

            // enable parsing computed object literal properties
            objectLiteralComputedProperties: true,

            // enable parsing of shorthand object literal methods
            objectLiteralShorthandMethods: true,

            // enable parsing of shorthand object literal properties
            objectLiteralShorthandProperties: true,

            // Allow duplicate object literal properties (except '__proto__')
            objectLiteralDuplicateProperties: true,

            // enable parsing of generators/yield
            generators: true,

            // enable parsing spread operator
            spread: true,

            // enable super in functions
            superInFunctions: true,

            // enable parsing classes
            classes: true,

            // enable parsing of modules
            modules: true,

            // enable React JSX parsing
            jsx: true,

            // enable return in global scope
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
