var rewire = require('rewire');
var templateFinderFactory = rewire('../../services/templateFinder');

describe("templateFinderFactory", function() {

  it("should complain if no template folders were provided", function() {
    expect(function() {
      templateFinderFactory(null, ['some-pattern']);
    }).toThrow();
    expect(function() {
      templateFinderFactory([], ['some-pattern']);
    }).toThrow();
  });


  it("should complain if no template patterns were provided", function() {
    expect(function() {
      templateFinderFactory(['x/y/z'], null);
    }).toThrow();
    expect(function() {
      templateFinderFactory(['x/y/z'], []);
    }).toThrow();
  });

  describe("templateFinder", function() {

    var glob, templateFinder, patterns, templateFolders;
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

      templateFinder = templateFinderFactory(templateFolders, patterns);
    });

    it("should match id followed by doctype if both are provided and the file exists", function() {
      expect(templateFinder({ docType: 'a', id: 'c'})).toEqual('c.a.x');
    });

    it("should match id before docType", function() {
      expect(templateFinder({ docType: 'a', id: 'b' })).toEqual('b.x');
    });

    it("should match docType if id doesn't match", function() {
      expect(templateFinder({ docType: 'a', id: 'missing' })).toEqual('a.x');
    });

    it("should match docType if id is undefined", function() {
      expect(templateFinder({ docType: 'a' })).toEqual('a.x');
    });

    it("should throw an error if no template was found", function() {
      expect(function() {
        templateFinder({docType:'missing'});
      }).toThrow();
    });

  });
});