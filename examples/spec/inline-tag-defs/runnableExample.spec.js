var tagDefinitionFactory = require('../../inline-tag-defs/runnableExample');
var createDocMessageFactory = require('../../../base/services/createDocMessage');
var StringMap = require('stringmap');

describe("runnableExampleInlineTagDef", function() {

  var exampleMap, tagDef;

  beforeEach(function() {
    exampleMap = new StringMap();
    exampleMap.set('some-example', {
      runnableExampleDoc: {
        renderedContent: 'The rendered content of the some-example example'
      }
    });
    tagDef = tagDefinitionFactory(exampleMap, createDocMessageFactory());
  });

  it("should have the correct name", function() {
    expect(tagDef.name).toEqual('runnableExample');
  });

  it("should lookup the runnableExampleDoc identified in the tag description and return its renderedContent", function() {
    expect(tagDef.handler({}, 'runnableExample', 'some-example')).toEqual('The rendered content of the some-example example');
  });
});