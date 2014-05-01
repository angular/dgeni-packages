var rewire = require('rewire');
var finderProcessor = rewire('../../processors/templateFinder');
var finderFactory = finderProcessor.exports.templateFinder[1];

describe("templateFinder Helper", function() {
  var fs, finder, patterns, templateFolders;
  beforeEach(function() {
    glob = finderProcessor.__get__('glob');
    spyOn(glob, 'sync').and.returnValue([
      'a.x',
      'b.x',
      'c.x',
      'c.a.x',
      'f.other'
    ]);
    patterns = [
      '${ doc.id }.${ doc.docType }.x',
      '${ doc.id }.x',
      '${ doc.docType }.x'
    ];
    templateFolders = ['abc'];

    finder = finderFactory({ rendering: { templateFolders: templateFolders, templatePatterns: patterns } });
  });

  it("should match id followed by doctype if both are provided and the file exists", function() {
    expect(finder({ docType: 'a', id: 'c'})).toEqual('c.a.x');
  });

  it("should match id before docType", function() {
    expect(finder({ docType: 'a', id: 'b' })).toEqual('b.x');
  });

  it("should match docType if id doesn't match", function() {
    expect(finder({ docType: 'a', id: 'missing' })).toEqual('a.x');
  });

  it("should match docType if id is undefined", function() {
    expect(finder({ docType: 'a' })).toEqual('a.x');
  });

  it("should throw an error if no template was found", function() {
    expect(function() {
      finder({docType:'missing'});
    }).toThrow();
  });

});