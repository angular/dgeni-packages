var tagDefFactory = require('./private');

describe("private tagDef", function() {
  var extractAccessTransform, extractTypeTransform, tagDef;

  beforeEach(function() {
    extractTypeTransform = function() {};
    extractAccessTransform = function() {};
    extractAccessTransform.allowedTags = new Map();
    tagDef = tagDefFactory(extractTypeTransform, extractAccessTransform);
  });

  it("should have correct name and property", function() {
    expect(tagDef.name).toEqual('private');
  });

  it("should add the injected transforms to the transforms property", function() {
    expect(tagDef.transforms).toEqual([extractTypeTransform, extractAccessTransform]);
  });

  it("should record itself in extractAccessTransform service", function() {
    expect(extractAccessTransform.allowedTags.has('private')).toBe(true);
    expect(extractAccessTransform.allowedTags.get('private')).toBeUndefined();
  });
});