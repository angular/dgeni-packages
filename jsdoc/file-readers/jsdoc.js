var _ = require('lodash');

/**
 * @dgService jsdocFileReader
 * @description
 * This file reader will create a simple doc for each js
 * file including a code AST of the JavaScript in the file.
 */
module.exports = function jsdocFileReader(log, jsParser) {
  return {
    name: 'jsdocFileReader',
    defaultPattern: /\.js$/,
    getDocs: function(fileInfo) {

      try {
        fileInfo.ast = jsParser(fileInfo.content);
      } catch(ex) {
       ex.file = fileInfo.filePath;
        throw new Error(
          _.template('JavaScript error in file "${file}"" [line ${lineNumber}, column ${column}]: "${description}"')(ex));
      }

      return [{
        docType: 'jsFile'
      }];
    }
  };
};