const tagDefFactory = require('./propertyof');

describe("propertyof tagDef", () => {
  it("should add the injected transforms to the transforms property", () => {
    const extractTypeTransform = () => {};
    const wholeTagTransform = () => {};

    const tagDef = tagDefFactory(extractTypeTransform, wholeTagTransform);
    expect(tagDef.transforms).toEqual([extractTypeTransform, wholeTagTransform]);
  });
});
