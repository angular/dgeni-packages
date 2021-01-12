var rewire = require('rewire');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var templateFinderFactory = rewire('./templateFinder');

describe("templateFinder", () => {

  var templateFinder;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    templateFinder = injector.get('templateFinder');
  });


  describe("getFinder", () => {

    var glob, patterns, templateFolders, findTemplate;

    beforeEach(() => {
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


    it("should match id followed by doctype if both are provided and the file exists", () => {
      expect(findTemplate({ docType: 'a', id: 'c'})).toEqual('c.a.x');
    });


    it("should match id before docType", () => {
      expect(findTemplate({ docType: 'a', id: 'b' })).toEqual('b.x');
    });


    it("should match docType if id doesn't match", () => {
      expect(findTemplate({ docType: 'a', id: 'missing' })).toEqual('a.x');
    });


    it("should match docType if id is undefined", () => {
      expect(findTemplate({ docType: 'a' })).toEqual('a.x');
    });


    it("should throw an error if no template was found", () => {
      expect(() => findTemplate({docType:'missing'})).toThrow();
    });

  });
});