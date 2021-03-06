const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');


const tagDefFactory = require('./link');

describe("links inline tag handler", () => {
  let tagDef, getLinkInfoSpy, doc, links, log;

  beforeEach(() => {

    getLinkInfoSpy = jasmine.createSpy('getLinkInfo');

    const testPackage = mockPackage()
      .factory('getLinkInfo', function getLinkInfo() {
        return getLinkInfoSpy;
      });

    const dgeni = new Dgeni([testPackage]);
    const injector = dgeni.configureInjector();
    log = injector.get('log');
    tagDef = injector.get('linkInlineTagDef');

    doc = {
      id: 'module:ng.directive:ngInclude',
      path: 'api/ng/directive/ngInclude',
      componentType: 'directive',
      module: 'ng',
      name: 'ngInclude',
      area: 'api',
      file: 'some/file.js',
      startingLine: 200,
      renderedContent: "Some text with a {@link some/url link} to somewhere\n" +
                       "Another text with a {@link another/url that spans\n two lines}\n" +
                       "Some example with a code link: {@link module:ngOther.directive:ngDirective}\n" +
                       "A link to reachable code: {@link ngInclude}"
    };

  });

  it("should have name 'link'", () => {
    expect(tagDef.name).toEqual('link');
  });

  it("should use the result of getLinkInfo to create a HTML anchor", () => {
    getLinkInfoSpy.and.returnValue({
      valid: true,
      url: 'some/url',
      title: 'link'
    });
    expect(tagDef.handler(doc, 'link', 'some/url link')).toEqual('<a href="some/url">link</a>');
    expect(getLinkInfoSpy).toHaveBeenCalled();
  });


  it("should log a warning if the link is invalid", () => {
    getLinkInfoSpy.and.returnValue({
      valid: false,
      error: 'Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"'
    });
    tagDef.handler(doc, 'link', 'module:ngOther.directive:ngDirective');
    expect(log.warn).toHaveBeenCalledWith('Invalid link (does not match any doc): "module:ngOther.directive:ngDirective" - doc "module:ng.directive:ngInclude"');
    expect(getLinkInfoSpy).toHaveBeenCalled();
  });
});