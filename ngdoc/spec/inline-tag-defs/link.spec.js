var _ = require('lodash');
var logger = require('winston');
var linkTagDef = require('../../inline-tag-defs/link');
var PartialNames = require('../../utils/partial-names').PartialNames;

describe("links inline tag handler", function() {
  var doc, links, logLevel, partialNames, linkHandler;

  it("should have name 'link'", function() {
    expect(linkTagDef.name).toEqual('link');
  });

  beforeEach(function() {
    logLevel = logger.level;
    logger.level = 'warn';
    spyOn(logger, 'warn');

    partialNames = new PartialNames();
    partialNames.addDoc({ id: 'module:ng.directive:ngInclude', path: 'api/ng/directive/ngInclude', name: 'ngInclude' });

    doc = {
      id: 'test.doc',
      componentType: 'directive',
      module: 'ng',
      name: 'ngInclude',
      area: 'api',
      file: 'some/file.js',
      startingLine: 200,
      renderedContent: "Some text with a {@link some/url link} to somewhere\n" +
                       "Some example with a code link: {@link module:ngOther.directive:ngDirective}\n" +
                       "A link to reachable code: {@link ngInclude}"
    };

    linkHandler = linkTagDef.handlerFactory(partialNames);
  });

  afterEach(function() {
    logger.level = logLevel;
  });

  it("should convert urls to HTML anchors", function() {
    expect(linkHandler(doc, 'some/url link', partialNames)).toEqual('<a href="some/url">link</a>');
  });

  it("should convert code links to anchors with formatted code", function() {
    expect(linkHandler(doc, 'ngInclude', partialNames)).toEqual('<a href="api/ng/directive/ngInclude"><code>ngInclude</code></a>');
  });

  it("should check that any links in the links property of a doc reference a valid doc", function() {
    expect(linkHandler(doc, 'module:ngOther.directive:ngDirective', partialNames)).toEqual('<a href="module:ngOther.directive:ngDirective">module:ngOther.directive:ngDirective</a>');
    expect(logger.warn).toHaveBeenCalled();
    expect(logger.warn.calls[0].args).toEqual([
      'Error processing link "module:ngOther.directive:ngDirective" for "test.doc" in file "some/file.js" at line 200:\n' +
      'Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"'
    ]);
  });
});