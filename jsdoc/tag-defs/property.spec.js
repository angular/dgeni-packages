const tagDefFactory = require('./property');

describe("property tagDef", () => {
  it("should add the injected transforms to the transforms property", () => {
    const extractNameTransform = () => {};
    const extractTypeTransform = () => {};
    const wholeTagTransform = () => {};

    const tagDef = tagDefFactory(extractTypeTransform, extractNameTransform, wholeTagTransform);
    expect(tagDef.transforms).toEqual([extractTypeTransform, extractNameTransform, wholeTagTransform]);
  });
});