var rewire = require('rewire');
var templateFinderFactory = rewire('../../services/templateFinder');
var mockLog = require('dgeni/lib/mocks/log')(false);

describe("templateFinder", function() {

  var templateFinder;

  beforeEach(function() {
    templateFinder = templateFinderFactory(mockLog);
  });

  describe("setTemplateFolders()", function() {

    it("should complain if no template folders were provided", function() {

      expect(function() {
        templateFinder.setTemplateFolders(null);
      }).toThrow();

      expect(function() {
        templateFinder.setTemplateFolders([]);
      }).toThrow();

    });
  });

  describe("setTemplatePatterns()", function() {

    it("should complain if no template patterns were provided", function() {

      expect(function() {
        templateFinder.setTemplatePatterns(null);
      }).toThrow();

      expect(function() {
        templateFinder.setTemplatePatterns([]);
      }).toThrow();

    });
  });

  describe("findTemplate", function() {

    var glob, patterns, templateFolders;

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

      templateFinder.setTemplateFolders(templateFolders);
      templateFinder.setTemplatePatterns(patterns);
    });


    it("should match id followed by doctype if both are provided and the file exists", function() {
      expect(templateFinder.findTemplate({ docType: 'a', id: 'c'})).toEqual('c.a.x');
    });


    it("should match id before docType", function() {
      expect(templateFinder.findTemplate({ docType: 'a', id: 'b' })).toEqual('b.x');
    });


    it("should match docType if id doesn't match", function() {
      expect(templateFinder.findTemplate({ docType: 'a', id: 'missing' })).toEqual('a.x');
    });


    it("should match docType if id is undefined", function() {
      expect(templateFinder.findTemplate({ docType: 'a' })).toEqual('a.x');
    });


    it("should throw an error if no template was found", function() {
      expect(function() {
        templateFinder.findTemplate({docType:'missing'});
      }).toThrow();
    });

  });
});