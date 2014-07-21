var rewire = require('rewire');
var templateFinderFactory = rewire('../../services/templateFinder');
var mockLog = require('dgeni/lib/mocks/log')(false);

describe("templateFinder", function() {

  var templateFinder;

  beforeEach(function() {
    templateFinder = templateFinderFactory(mockLog);
  });


  describe("getFinder", function() {

    var glob, patterns, templateFolders, findTemplate;

    beforeEach(function() {
      glob = templateFinderFactory.__get__('glob');
      spyOn(glob, 'sync').and.returnValue([
        'a.x', 'b.x', 'c.x', 'c.a.x', 'f.other'
      ]);
      patterns = [
        '${ doc.id }.${ doc.docType }.x',
        '${ doc.id }.x',
        '${ doc.docType }.x'
      ];
      templateFolders = ['abc'];

      templateFinder.templateFolders = templateFolders;
      templateFinder.templatePatterns = patterns;

      findTemplate = templateFinder.getFinder();
    });


    it("should match id followed by doctype if both are provided and the file exists", function() {
      expect(findTemplate({ docType: 'a', id: 'c'})).toEqual('c.a.x');
    });


    it("should match id before docType", function() {
      expect(findTemplate({ docType: 'a', id: 'b' })).toEqual('b.x');
    });


    it("should match docType if id doesn't match", function() {
      expect(findTemplate({ docType: 'a', id: 'missing' })).toEqual('a.x');
    });


    it("should match docType if id is undefined", function() {
      expect(findTemplate({ docType: 'a' })).toEqual('a.x');
    });


    it("should throw an error if no template was found", function() {
      expect(function() {
        findTemplate({docType:'missing'});
      }).toThrow();
    });

  });
});