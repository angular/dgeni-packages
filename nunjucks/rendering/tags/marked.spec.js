const Dgeni = require('dgeni');
const mockPackage = require('../../mocks/mockPackage');
const nunjucks = require('nunjucks');

describe("marked custom tag extension", () => {
  let extension;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();

    extension = injector.get('markedNunjucksTag');
  });

  it("should specify the tags to match", () => {
    expect(extension.tags).toEqual(['marked']);
  });

  describe("process", () => {

    it("should render the markdown and reindent", () => {
      const result = extension.process(null, () => {
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
      const log = [];
      const parserMock = {
        advanceAfterBlockEnd() { log.push('advanceAfterBlockEnd'); },
        parseUntilBlocks() { log.push('parseUntilBlocks'); return 'some content'; }
      };
      const nodesMock = {
        CallExtension: function CallExtension() { log.push('CallExtension'); this.args = arguments; }
      };

      const tag = extension.parse(parserMock, nodesMock);

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
      const engine = new nunjucks.Environment(null, {autoescape: true});
      engine.addExtension('marked', extension);
      const renderedContent = engine.renderString('{% marked %}some `inline code`{% endmarked %}', {});
      expect(renderedContent).toEqual('<p>some <code>inline code</code></p>\n');
    });
  });
});