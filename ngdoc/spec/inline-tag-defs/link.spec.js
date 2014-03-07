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
                       "Some example with a code link: {@link module:ngOther.directive:ngDirective}\n" +
                       "A link to reachable code: {@link ngInclude}"
    };

    partialNames = new PartialNames();
    partialNames.addDoc(doc);

    linkHandler = linkTagDef.handlerFactory(partialNames);
  });

  afterEach(function() {
    logger.level = logLevel;
  });

  it("should convert urls to HTML anchors", function() {
    expect(linkHandler(doc, 'link', 'some/url link')).toEqual('<a href="some/url">link</a>');
  });

  it("should convert code links to anchors with formatted code", function() {
    expect(linkHandler(doc, 'link', 'ngInclude')).toEqual('<a href="api/ng/directive/ngInclude"><code>ngInclude</code></a>');
  });

  it("should check that any links in the links property of a doc reference a valid doc", function() {
    expect(function() {
      linkHandler(doc, 'link', 'module:ngOther.directive:ngDirective');
    }).toThrow('Invalid link (does not match any doc): "module:ngOther.directive:ngDirective"');
  });
});