var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("linkExtractor", function() {
  var urlExtractor;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    linkExtractor = injector.get('linkExtractor');
  });

  describe("extractLinks", function() {
    it("should extract the links from anchors", function() {
      expect(linkExtractor.extractLinks('<a href="foo">bar</a>')).toEqual(
        {
          hrefs: ['foo'],
          names: []
        }
      );
      expect(linkExtractor.extractLinks('<a href="foo">bar</a><a href="man">shell</a>')).toEqual(
        {
          hrefs: ['foo', 'man'],
          names: []
        }
      );
      expect(linkExtractor.extractLinks('<div href="foo">bar</div>')).toEqual(
        {hrefs: [], names: [] }
      );
      expect(linkExtractor.extractLinks('<a name="foo">bar</a><a href="man">shell</a>')).toEqual(
        {
          hrefs: ['man'],
          names: ['foo']
        }
      );
    });
  });
});
