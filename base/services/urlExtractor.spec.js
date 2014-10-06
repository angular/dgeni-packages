var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("urlExtractor", function() {
  var urlExtractor;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    urlExtractor = injector.get('urlExtractor');
  });

  describe("calculatePath", function() {
    it("should calculate absolute paths", function() {
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html', ''))
        .toEqual('absolutePath/absoluteFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html', '/'))
        .toEqual('absolutePath/absoluteFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html', '/base'))
        .toEqual('absolutePath/absoluteFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html', '/base/'))
        .toEqual('absolutePath/absoluteFile.html');
    });

    it('should use the base path when the path is relative and there is a base path', function() {
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', 'relativePath/relativeFile.html', '/'))
        .toEqual('relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', 'relativePath/relativeFile.html', '/base'))
        .toEqual('base/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', 'relativePath/relativeFile.html', '/base/'))
        .toEqual('base/relativePath/relativeFile.html');
    });

    it('should use the current directory when there is no base path', function() {
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', 'relativePath/relativeFile.html', ''))
        .toEqual('currentPath/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html', 'relativePath/relativeFile.html', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('currentFile.html', 'relativePath/relativeFile.html', ''))
        .toEqual('relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('', 'relativePath/relativeFile.html', ''))
        .toEqual('relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath(null, 'relativePath/relativeFile.html', ''))
        .toEqual('relativePath/relativeFile.html');
    });

    it('should remove any sufixes', function() {
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html?foo=bar', ''))
        .toEqual('absolutePath/absoluteFile.html');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html#foo', ''))
        .toEqual('absolutePath/absoluteFile.html#foo');
      expect(urlExtractor.calculatePath('currentPath/currentFile.html', '/absolutePath/absoluteFile.html?bar=baz#foo', ''))
        .toEqual('absolutePath/absoluteFile.html#foo');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html?foo=bar', 'relativePath/relativeFile.html', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html#foo', 'relativePath/relativeFile.html', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html', 'relativePath/relativeFile.html?foo=bar', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html', 'relativePath/relativeFile.html#foo', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html#foo');
      expect(urlExtractor.calculatePath('onePath/currentPath/currentFile.html', 'relativePath/relativeFile.html?bar=baz#foo', ''))
        .toEqual('onePath/currentPath/relativePath/relativeFile.html#foo');
    });

    it('should remove any /./ in the path', function() {
      expect(urlExtractor.calculatePath('currentFile.html', '/./absolutePath/./absoluteFile.html', ''))
        .toEqual('absolutePath/absoluteFile.html');
    });

    it('should remove any dangling / at the end', function() {
      expect(urlExtractor.calculatePath('currentFile.html', 'absolutePath/', ''))
        .toEqual('absolutePath');
    });
  });
});
