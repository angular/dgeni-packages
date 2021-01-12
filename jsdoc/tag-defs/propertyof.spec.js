var tagDefFactory = require('./propertyof');

describe("propertyof tagDef", () => {
  it("should add the injected transforms to the transforms property", () => {
    var extractTypeTransform = () => {};
    var wholeTagTransform = () => {};

    var tagDef = tagDefFactory(extractTypeTransform, wholeTagTransform);
    expect(tagDef.transforms).toEqual([extractTypeTransform, wholeTagTransform]);
  });
});
