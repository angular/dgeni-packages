var extractor = require('../../extractors/jsdoc');

var srcJsContent = require('./_test-data/srcJsFile.js');
var docsFromJsContent = require('./_test-data/docsFromJsFile');

describe("js doc extractor", function() {

  describe("pattern", function() {
    it("should only match js files", function() {
      expect(extractor.pattern.test('abc.js')).toBeTruthy();
      expect(extractor.pattern.test('abc.ngdoc')).toBeFalsy();
    });
  });


  describe("process", function() {

    it('should return a collection of documents extracted from the file', function() {
      var docs = extractor.processFile('some/file.js', srcJsContent);
      expect(docs.length).toEqual(3);
      expect(docs[0]).toEqual(jasmine.objectContaining(docsFromJsContent[0]));
      expect(docs[1]).toEqual(jasmine.objectContaining(docsFromJsContent[1]));
      expect(docs[2]).toEqual(jasmine.objectContaining(docsFromJsContent[2]));
    });


    it("should strip off the leading whitespace/stars from each line of the comments", function() {
      var docs = extractor.processFile('some/file.js', '/** abc  \n  * other stuff  \n\t\t*last line.\n*/\n');
      expect(docs[0].content).toEqual('abc  \nother stuff  \nlast line.');
    });


    it("should ignore non-jsdoc comments", function() {
      var docs = extractor.processFile('some/file.js', '/** Some jsdoc comment */\n// A line comment\n\/* A non-jsdoc block comment*/');
      expect(docs.length).toEqual(1);
    });


    it("should find the next code item following the comment and attach it to the doc", function() {
      var docs = extractor.processFile('some/file.js', srcJsContent);
      expect(docs.length).toEqual(3);
      expect(docs[0].code.node.type).toEqual('FunctionDeclaration');
      expect(docs[1].code.node.type).toEqual('ExpressionStatement');
      expect(docs[2].code.node.type).toEqual('ReturnStatement');
    });

    it("should not remove windows new line characters when stripping stars from comments", function() {
        var docs = extractor.processFile('some/file.js', '/** Some jsdoc comment\r\n* over multiple\r\n* lines\r\n**/');
        expect(docs[0].content).toEqual('Some jsdoc comment\r\nover multiple\r\nlines');
    });
  });
});