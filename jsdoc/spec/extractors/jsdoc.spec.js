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

    it("should ignore non-jsdoc comments", function() {
      var docs = extractor.processFile('some/file.js', '/** Some jsdoc comment */\n// A line comment\n\/* A non-jsdoc block comment*/');
      expect(docs.length).toEqual(1);
    });
  });
});