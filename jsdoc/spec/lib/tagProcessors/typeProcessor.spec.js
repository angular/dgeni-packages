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

  it("should cope with nested braces", function() {
    var tag = new Tag(tagDef, 'someTag', '  {{a: number, b: string, c}} \n   paramName - Some description', 0);
    tags.addTag(tag);
    typeProcessor(tags);
    expect(tag.typeExpression).toEqual('{a: number, b: string, c}');
  });

  it("should cope with escaped braces", function() {
    var tag = new Tag(tagDef, 'someTag', '  {weirdObject."with\\}AnnoyingProperty"} \n   paramName - Some description', 0);
    tags.addTag(tag);
    typeProcessor(tags);
    expect(tag.typeExpression).toEqual('weirdObject."with}AnnoyingProperty"');
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

  it("should set the optional property to true if the type is optional", function() {
    var tag = new Tag(tagDef, 'someTag', '{string=} paramName - some description', 0);
    tags.addTag(tag);
    typeProcessor(tags);
    expect(tag.optional).toEqual(true);
  });

});