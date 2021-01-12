var Dgeni = require('dgeni');
var mockPackage = require('../../mocks/mockPackage');
var nunjucks = require('nunjucks');

describe("marked custom tag extension", () => {
  var extension;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    extension = injector.get('markedNunjucksTag');
  });

  it("should specify the tags to match", () => {
    expect(extension.tags).toEqual(['marked']);
  });

  describe("process", () => {

    it("should render the markdown and reindent", () => {
      var result = extension.process(null, () => {
        return '  ## heading 2\n\n' +
               '  some paragraph\n\n' +
               '    * a bullet point';
      });
      expect(result).toEqual(
        '  <h2 id="heading-2">heading 2</h2>\n' +
        '  <p>some paragraph</p>\n' +
        '  <ul>\n' +
        '  <li>a bullet point</li>\n' +
        '  </ul>\n' +
        '  '
      );
    });

  });

  describe("parse", () => {
    it("should interact correctly with the parser", () => {
      var log = [];
      var parserMock = {
        advanceAfterBlockEnd() { log.push('advanceAfterBlockEnd'); },
        parseUntilBlocks() { log.push('parseUntilBlocks'); return 'some content'; }
      };
      var nodesMock = {
        CallExtension: function CallExtension() { log.push('CallExtension'); this.args = arguments; }
      };

      var tag = extension.parse(parserMock, nodesMock);

      expect(log).toEqual([
        'advanceAfterBlockEnd',
        'parseUntilBlocks',
        'CallExtension',
        'advanceAfterBlockEnd'
      ]);

      expect(tag.args[0]).toEqual(extension);
      expect(tag.args[1]).toEqual('process');
      expect(tag.args[3]).toEqual(['some content']);
    });
  });

  describe('(when used with nunjucks)', () => {
    it('should not escape the output of the tag, even if nunjucks is configured to escape output', () => {
      var engine = new nunjucks.Environment(null, {autoescape: true});
      engine.addExtension('marked', extension);
      const renderedContent = engine.renderString('{% marked %}some `inline code`{% endmarked %}', {});
      expect(renderedContent).toEqual('<p>some <code>inline code</code></p>\n');
    });
  });
});