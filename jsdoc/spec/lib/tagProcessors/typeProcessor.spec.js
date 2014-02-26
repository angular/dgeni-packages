var Tag = require('../../../lib/Tag');
var TagCollection = require('../../../lib/TagCollection');
var typeProcessor = require('../../../lib/tagProcessors/typeProcessor');

describe("typeProcessor", function() {

  var tagDef, tags;

  beforeEach(function() {
    tagDef = {
      name: 'someTag',
      canHaveType: true
    };

    tags = new TagCollection();
  });

  it("should extract the trimmed typeExpression from the description", function() {
    var tag = new Tag(tagDef, 'someTag', '  { Function|Array<String>= } \n   paramName - Some description', 0);
    tags.addTag(tag);
    typeProcessor(tags);
    expect(tag.typeExpression).toEqual('Function|Array<String>=');
  });

  it("should remove the typeExpression from the description", function() {
    var tag = new Tag(tagDef, 'someTag', '  { Function|Array<String>= } \n   paramName - Some description', 0);
    tags.addTag(tag);
    typeProcessor(tags);
    expect(tag.description).toEqual('paramName - Some description');
  });

});