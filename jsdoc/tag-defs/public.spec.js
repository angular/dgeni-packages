const tagDefFactory = require('./public');

describe("public tagDef", () => {
  let extractAccessTransform, extractTypeTransform, tagDef;

  beforeEach(() => {
    extractTypeTransform = () => {};
    extractAccessTransform = () => {};
    extractAccessTransform.allowedTags = new Map();
    tagDef = tagDefFactory(extractTypeTransform, extractAccessTransform);
  });

  it("should have correct name and property", () => {
    expect(tagDef.name).toEqual('public');
  });

  it("should add the injected transforms to the transforms property", () => {
    expect(tagDef.transforms).toEqual([extractTypeTransform, extractAccessTransform]);
  });

  it("should record itself in extractAccessTransform service", () => {
    expect(extractAccessTransform.allowedTags.has('public')).toBe(true);
    expect(extractAccessTransform.allowedTags.get('public')).toBeUndefined();
  });
});