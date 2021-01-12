var tagDefFactory = require('./param');

describe('param tagDef', () => {
  it("should add the injected transforms to the transforms property", () => {
    var extractNameTransform = () => {};
    var extractTypeTransform = () => {};
    var wholeTagTransform = () => {};

    var tagDef = tagDefFactory(extractTypeTransform, extractNameTransform, wholeTagTransform);
    expect(tagDef.transforms).toEqual([extractTypeTransform, extractNameTransform, wholeTagTransform]);
  });
});