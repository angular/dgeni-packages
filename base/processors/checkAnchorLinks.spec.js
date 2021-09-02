const path = require('canonical-path');

const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("checkAnchorLinks", () => {
  let processor, mockLog;

  function checkWarning(link, doc) {
    expect(mockLog.warn).toHaveBeenCalled();
    expect(mockLog.warn.calls.first().args[0]).toContain(doc);
    expect(mockLog.warn.calls.first().args[0]).toContain(link);
  }

  function createDoc(docType, renderedContent, path, outputPath, relativePath, startingLine, endingLine) {
    return {
      path,
      outputPath,
      docType,
      fileInfo: {
        relativePath
      },
      renderedContent,
      startingLine,
      endingLine
    };
  }

  beforeEach(() => {
    const testPackage = mockPackage();
    const dgeni = new Dgeni([testPackage]);
    const injector = dgeni.configureInjector();

    processor = injector.get('checkAnchorLinksProcessor');
    mockLog = injector.get('log');
  });

  it("should warn when there is a dangling link", () => {
    processor.$process([createDoc('content', '<a href="foo"></a>', 'doc/path', 'doc/path.html', 'doc/path.md', 0, 1)]);
    checkWarning('foo', 'doc/path.md');
  });

  it('should abort when there is a dangling link and `errorOnUnmatchedLinks` is true', () => {
    processor.errorOnUnmatchedLinks = true;
    expect(() => {
      processor.$process([{ renderedContent: '<a href="foo"></a>', outputPath: 'doc/path.html', path: 'doc/path' }]);
    }).toThrowError(/1 unmatched link/);
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
    ]);
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
      createDoc('api', '<a href="#foo">to foo</a>', 'a/b/c/x', 'dist/a/b/c/x.html', 'src/a/b/c/x.js', 45, 48),
    ]);
    checkWarning('#foo', 'src/a/b/c/x.js');
  });

  it("should warn for internal, cross page, dangling links", () => {
    processor.$process([
      createDoc('content', '<a name="foo">foo</a>', 'x', 'x.html', 'x.md'),
      createDoc('content', '<a href="x#bar">to bar</a>', 'y', 'y.html', 'y.md'),
    ]);
    checkWarning('x#bar', 'y.md');
  });

  it("should skip non-anchor elements", () => {
    processor.$process([
      { renderedContent: '<div href="foo"></div>', outputPath: 'c.html', path: 'c' }
    ]);
    expect(mockLog.warn).not.toHaveBeenCalled();
  });
});
