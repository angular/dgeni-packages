var _ = require('lodash');
var esprima = require('esprima');

/**
 * @dgService jsdocFileReader
 * @description
 * This file reader will create a simple doc for each js
 * file including a code AST of the JavaScript in the file.
 */
module.exports = function jsdocFileReader() {
  return {
    name: 'jsdocFileReader',
    defaultPattern: /\.js$/,
    getDocs: function(fileInfo) {

      fileInfo.ast = esprima.parse(fileInfo.content, {
        loc: true,
        attachComment: true
      });

      return [{
        docType: 'jsFile'
      }];
    }
  };
};