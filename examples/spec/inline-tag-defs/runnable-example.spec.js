var tagDefinition = require('../../inline-tag-defs/runnableExample');

describe("runnableExample inline tag definition", function() {
  it("should have the correct name", function() {
    expect(tagDefinition.name).toEqual('runnableExample');
  });

  it("should lookup the runnableExampleDoc identified in the tag description and return its renderedContent", function() {
    var handler = tagDefinition.handlerFactory({ 'some-example' : {
      runnableExampleDoc: {
        renderedContent: 'The rendered content of the some-example example'
      }
    }});

    expect(handler({}, 'runnableExample', 'some-example')).toEqual('The rendered content of the some-example example');
  });
});