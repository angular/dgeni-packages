var path = require('canonical-path');
var Q = require('q');

var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("checkAnchorLinks", function() {
  var processor, mockLog;


  beforeEach(function() {
    var testPackage = mockPackage();
    var dgeni = new Dgeni([testPackage]);
    var injector = dgeni.configureInjector();

    processor = injector.get('checkAnchorLinksProcessor');
    mockLog = injector.get('log');
  });

  it("should warning when there is a dangling link", function() {
    processor.$process([{ renderedContent: '<a href="foo"></a>', outputPath: 'doc/path.html' }]);
    expect(mockLog.warn).toHaveBeenCalledWith('Link found at', 'doc/path.html', 'pointing to dangling reference', 'foo');
  });

  it("should not create a warning when there is a page that point to the path", function() {
    processor.$process([
      { renderedContent: '<a href="/foo"></a>', outputPath: 'doc/path.html' },
      { renderedContent: 'CONTENT OF FOO', outputPath: 'foo.html' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should skip files that are not .html", function() {
    processor.$process([
      { renderedContent: '<a href="/foo"></a>', outputPath: 'x.js' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should skip external and mailto links", function() {
    processor.$process([
      { renderedContent: '<a>foo</a>', outputPath: 'x.html' },
      { renderedContent: '<a href="http://www.google.com">foo</a>', outputPath: 'a.html' },
      { renderedContent: '<a href="mailto:foo@foo.com">foo</a>', outputPath: 'c.html' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should be able to resolve internal links", function() {
    processor.$process([
      { renderedContent: '<a name="foo">foo</a><a href="#foo">to foo</a>', outputPath: 'x.html' },
      { renderedContent: '<a href="x#foo">foo</a>', outputPath: 'a.html' },
      { renderedContent: '<a href="x.html#foo">foo</a>', outputPath: 'b.html' },
      { renderedContent: '<a href="x#">foo</a>', outputPath: 'c.html' },
      { renderedContent: '<a href="x.html#">foo</a>', outputPath: 'd.html' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should report internal, same page, dangling links", function() {
    processor.$process([
      { renderedContent: '<a href="#foo">to foo</a>', outputPath: 'x.html' }
    ]);
    expect(mockLog.warn).toHaveBeenCalledWith('Link found at', 'x.html', 'pointing to dangling reference', '#foo');
  });

  it("should report internal, cross pages, dangling links", function() {
    processor.$process([
      { renderedContent: '<a name="foo">foo</a>', outputPath: 'x.html' },
      { renderedContent: '<a href="x#bar">to bar</a>', outputPath: 'y.html' }
    ]);
    expect(mockLog.warn).toHaveBeenCalledWith('Link found at', 'y.html', 'pointing to dangling reference', 'x#bar');
  });

  it("should skip non-anchor elements", function() {
    processor.$process([
      { renderedContent: '<div href="foo"></div>', outputPath: 'c.html' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });
});
