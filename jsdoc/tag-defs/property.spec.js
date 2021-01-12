var tagDefFactory = require('./property');

describe("property tagDef", () => {
  it("should add the injected transforms to the transforms property", () => {
    var extractNameTransform = () => {};
    var extractTypeTransform = () => {};
    var wholeTagTransform = () => {};

    var tagDef = tagDefFactory(extractTypeTransform, extractNameTransform, wholeTagTransform);
    expect(tagDef.transforms).toEqual([extractTypeTransform, extractNameTransform, wholeTagTransform]);
  });
});