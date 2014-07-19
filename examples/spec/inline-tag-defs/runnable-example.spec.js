require('es6-shim');
var tagDefinitionFactory = require('../../inline-tag-defs/runnableExample');

describe("runnableExampleInlineTagDef", function() {

  var examples, tagDef;

  beforeEach(function() {
    examples = new Map();
    examples.set('some-example', {
      runnableExampleDoc: {
        renderedContent: 'The rendered content of the some-example example'
      }
    });
    tagDef = tagDefinitionFactory(examples);
  });

  it("should have the correct name", function() {
    expect(tagDef.name).toEqual('runnableExample');
  });

  it("should lookup the runnableExampleDoc identified in the tag description and return its renderedContent", function() {
    expect(tagDef.handler({}, 'runnableExample', 'some-example')).toEqual('The rendered content of the some-example example');
  });
});