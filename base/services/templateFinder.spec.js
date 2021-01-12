const rewire = require('rewire');
const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');
var templateFinderFactory = rewire('./templateFinder');

describe("templateFinder", () => {

  let templateFinder;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    templateFinder = injector.get('templateFinder');
  });


  describe("getFinder", () => {

    let glob, patterns, templateFolders, findTemplate;

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