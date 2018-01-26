var path = require('canonical-path');

var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("checkAnchorLinks", () => {
  var processor, mockLog;

  function checkWarning(link, doc) {
    expect(mockLog.warn).toHaveBeenCalled();
    expect(mockLog.warn.calls.first().args[0]).toContain(doc);
    expect(mockLog.warn.calls.first().args[0]).toContain(link);
  }


  beforeEach(() => {
    var testPackage = mockPackage();
    var dgeni = new Dgeni([testPackage]);
    var injector = dgeni.configureInjector();

    processor = injector.get('checkAnchorLinksProcessor');
    mockLog = injector.get('log');
  });

  it("should warn when there is a dangling link", () => {
    processor.$process([{ renderedContent: '<a href="foo"></a>', outputPath: 'doc/path.html', path: 'doc/path' }]);
    checkWarning('foo', 'doc/path.html');
  });

  it('should abort when there is a dangling link and `errorOnUnmatchedLinks` is true', () => {
    processor.errorOnUnmatchedLinks = true;
    expect(() => {
      processor.$process([{ renderedContent: '<a href="foo"></a>', outputPath: 'doc/path.html', path: 'doc/path' }]);
    }).toThrowError('1 unmatched links');
  });

  it("should not warn when there is a page for a link", () => {
    processor.$process([
      { renderedContent: '<a href="/foo"></a>', outputPath: 'doc/path.html', path: 'doc/path' },
      { renderedContent: 'CONTENT OF FOO', outputPath: 'foo.html', path: 'foo' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it('should match links who are prone to uri encoding', () => {
    processor.$process([
      { renderedContent: '<a href="Foo extends Bar"></a>', outputPath: 'doc/path.html', path: 'doc/path' },
      { renderedContent: 'CONTENT OF FOO', outputPath: 'doc/Foo extends Bar.html', path: 'doc/Foo extends Bar' }
    ])
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should not warn if the link matches a path after it has been modified with a path variant", () => {
    processor.$process([
      { renderedContent: '<a href="/foo"></a>', outputPath: 'doc/path.html', path: 'doc/path' },
      { renderedContent: 'CONTENT OF FOO', outputPath: 'foo.html', path: 'foo/' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should skip files that do not pass the `checkDoc` method", () => {
    processor.$process([
      { renderedContent: '<a href="/foo"></a>', outputPath: 'x.js', path: 'x' },
      { renderedContent: '<a href="/foo"></a>', outputPath: 'x.html' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should skip links that match the `ignoredLinks` property", () => {
    processor.$process([
      { renderedContent: '<a>foo</a>', outputPath: 'x.html', path: 'x' },
      { renderedContent: '<a href="http://www.google.com">foo</a>', outputPath: 'a.html', path: 'a' },
      { renderedContent: '<a href="mailto:foo@foo.com">foo</a>', outputPath: 'c.html', path: 'c' },
      { renderedContent: '<a href="chrome://accessibility">Accessibility</a>', outputPath: 'c.html', path: 'c' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should not warn for links to named anchors", () => {
    processor.$process([
      { renderedContent: '<a name="foo">foo</a><a href="#foo">to foo</a>', outputPath: 'x.html', path: 'x' },
      { renderedContent: '<a href="x#foo">foo</a>', outputPath: 'a.html', path: 'a'},
      { renderedContent: '<a href="x.html#foo">foo</a>', outputPath: 'b.html', path: 'b'},
      { renderedContent: '<a href="x#">foo</a>', outputPath: 'c.html', path: 'c'},
      { renderedContent: '<a href="x.html#">foo</a>', outputPath: 'd.html', path: 'd'}
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should not warn for links to elements defined by id", () => {
    processor.$process([
      { renderedContent: '<div id="foo">foo</div><a href="#foo">to foo</a>', outputPath: 'x.html', path: 'x' },
      { renderedContent: '<a href="x#foo">foo</a>', outputPath: 'a.html', path: 'a'},
      { renderedContent: '<a href="x.html#foo">foo</a>', outputPath: 'b.html', path: 'b'},
      { renderedContent: '<a href="x#">foo</a>', outputPath: 'c.html', path: 'c'},
      { renderedContent: '<a href="x.html#">foo</a>', outputPath: 'd.html', path: 'd'}
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it('should cope with non-latin characters in the fragment that get url encoded', () => {
    processor.$process([
      { renderedContent: '<div id="모듈">모듈</div><a href="#%EB%AA%A8%EB%93%88">to 모듈</a>', outputPath: 'a.html', path: 'a' },
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });

  it("should warn for internal, same page, dangling links", () => {
    processor.$process([
      { renderedContent: '<a href="#foo">to foo</a>', outputPath: 'x.html', path: 'x' }
    ]);
    checkWarning('#foo', 'x.html');
  });

  it("should warn for internal, cross page, dangling links", () => {
    processor.$process([
      { renderedContent: '<a name="foo">foo</a>', outputPath: 'x.html', path: 'x' },
      { renderedContent: '<a href="x#bar">to bar</a>', outputPath: 'y.html', path: 'y' }
    ]);
    checkWarning('x#bar', 'y.html');
  });

  it("should skip non-anchor elements", () => {
    processor.$process([
      { renderedContent: '<div href="foo"></div>', outputPath: 'c.html', path: 'c' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });
});
