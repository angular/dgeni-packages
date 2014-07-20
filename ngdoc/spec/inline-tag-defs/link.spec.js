var tagDefFactory = require('../../inline-tag-defs/link');

describe("links inline tag handler", function() {
  var tagDef, getLinkInfoSpy, doc, links;

  beforeEach(function() {
    getLinkInfoSpy = jasmine.createSpy('getLinkInfo');
    tagDef = tagDefFactory(getLinkInfoSpy);

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

  it("should have name 'link'", function() {
    expect(tagDef.name).toEqual('link');
  });

  it("should use the result of getLinkInfo to create a HTML anchor", function() {
    getLinkInfoSpy.and.returnValue({
      valid: true,
      url: 'some/url',
      title: 'link'
    });
    expect(tagDef.handler(doc, 'link', 'some/url link')).toEqual('<a href="some/url">link</a>');
    expect(getLinkInfoSpy).toHaveBeenCalled();
  });


  it("should throw an error if the link is invalid", function() {
    getLinkInfoSpy.and.returnValue({
      valid: false,
      error: 'Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"'
    });
    expect(function() {
      tagDef.handler(doc, 'link', 'module:ngOther.directive:ngDirective');
    }).toThrowError('Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"');
    expect(getLinkInfoSpy).toHaveBeenCalled();
  });
});