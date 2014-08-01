var path = require('canonical-path');
var fileReaderFactory = require('../../file-readers/jsdoc');

var srcJsContent = require('./_test-data/srcJsFile.js');
var docsFromJsContent = require('./_test-data/docsFromJsFile');


describe("jsdoc fileReader", function() {

  var fileReader;

  var createFileInfo = function(file, content, basePath) {
    return {
      fileReader: fileReader.name,
      filePath: file,
      baseName: path.basename(file, path.extname(file)),
      extension: path.extname(file).replace(/^\./, ''),
      basePath: basePath,
      relativePath: path.relative(basePath, file),
      content: content
    };
  };

  beforeEach(function() {
    fileReader = fileReaderFactory();
  });

  describe("defaultPattern", function() {

    it("should only match js files", function() {
      expect(fileReader.defaultPattern.test('abc.js')).toBeTruthy();
      expect(fileReader.defaultPattern.test('abc.ngdoc')).toBeFalsy();
    });

  });


  describe("process", function() {

    it('should return a collection of documents extracted from the file', function() {
      var fileInfo = createFileInfo('some/file.js', srcJsContent, '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs.length).toEqual(3);
      expect(docs[0]).toEqual(jasmine.objectContaining(docsFromJsContent[0]));
      expect(docs[1]).toEqual(jasmine.objectContaining(docsFromJsContent[1]));
      expect(docs[2]).toEqual(jasmine.objectContaining(docsFromJsContent[2]));
    });

    it("should set the docType to js", function() {
      var fileInfo = createFileInfo('some/file.js', '/** @some jsdoc comment */', '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs[0].docType).toEqual('js');
    });


    it("should strip off the leading whitespace/stars from each line of the comments", function() {
      var fileInfo = createFileInfo('some/file.js', '/** abc  \n  * other stuff  \n\t\t*last line.\n*/\n', '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs[0].content).toEqual('abc  \nother stuff  \nlast line.');
    });


    it("should ignore non-jsdoc comments", function() {
      var fileInfo = createFileInfo('some/file.js', '/** Some jsdoc comment */\n// A line comment\n\/* A non-jsdoc block comment*/', '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs.length).toEqual(1);
    });


    it("should find the next code item following the comment and attach it to the doc", function() {
      var fileInfo = createFileInfo('some/file.js', srcJsContent, '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs.length).toEqual(3);
      expect(docs[0].codeNode.node.type).toEqual('FunctionDeclaration');
      expect(docs[1].codeNode.node.type).toEqual('ExpressionStatement');
      expect(docs[2].codeNode.node.type).toEqual('ReturnStatement');
    });


    it("should not break if the comment has no code", function() {
      var fileInfo = createFileInfo('some/file.js', 'function main() { } /** @some jsdoc comment */', '.');
      expect(function() {
        var docs = fileReader.getDocs(fileInfo);
        expect(docs.length).toEqual(1);
      }).not.toThrow();
    });


    it("should not remove windows new line characters when stripping stars from comments", function() {
      var fileInfo = createFileInfo('some/file.js', '/** Some jsdoc comment\r\n* over multiple\r\n* lines\r\n**/', '.');
      var docs = fileReader.getDocs(fileInfo);
      expect(docs[0].content).toEqual('Some jsdoc comment\r\nover multiple\r\nlines');
    });
  });
});