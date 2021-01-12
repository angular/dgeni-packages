const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("extractLinks", () => {
  let extractLinks;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    extractLinks = injector.get('extractLinks');
  });

  it("should extract the hrefs from anchors", () => {
    expect(extractLinks('<a href="foo">bar</a>').hrefs).toEqual(['foo']);
    expect(extractLinks('<a href="foo">bar</a><a href="man">shell</a>').hrefs).toEqual(['foo', 'man']);
    expect(extractLinks('<div href="foo">bar</div>').hrefs).toEqual([]);
  });

  it("should extract the names from anchors", () => {
    expect(extractLinks('<a name="foo">bar</a><a href="man">shell</a>').names).toEqual(['foo']);
    expect(extractLinks('<div name="foo">bar</div>').names).toEqual([]);
  });

  it("should extract the ids from elements", () => {
    expect(extractLinks('<a id="foo">bar</a><a href="man">shell</a>').names).toEqual(['foo']);
    expect(extractLinks('<div id="foo">bar</div>').names).toEqual(['foo']);
  });
});
