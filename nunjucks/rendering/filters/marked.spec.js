var Dgeni = require('dgeni');
var mockPackage = require('../../mocks/mockPackage');

describe("marked custom filter", () => {
  var filter;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    filter = injector.get('markedNunjucksFilter');
  });

  it("should have the name 'marked'", () => {
    expect(filter.name).toEqual('marked');
  });

  it("should transform the content as markdown trimming excess code indentation", () => {
      var result = filter.process(
        '## heading 2\n\n' +
        'some paragraph\n\n' +
        '  * a bullet point\n\n' +
        '```\n' +
        '  code\n' +
        '    indented code\n' +
        '  code\n' +
        '```'
      );
      expect(result).toEqual(
        '<h2 id="heading-2">heading 2</h2>\n' +
        '<p>some paragraph</p>\n' +
        '<ul>\n' +
        '<li>a bullet point</li>\n' +
        '</ul>\n' +
        '<pre><code>code\n' +
        '  indented code\n' +
        'code</code></pre>\n' +
        ''
      );
  });
});