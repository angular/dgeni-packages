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
    getDocs(fileInfo) {

      try {
        fileInfo.ast = jsParser(fileInfo.content);
      } catch(ex) {
        ex.file = fileInfo.filePath;
        throw new Error(`JavaScript error in file "${ex.file}" [line ${ex.lineNumber}, column ${ex.column}]`);
      }

      return [{
        docType: 'jsFile'
      }];
    }
  };
};