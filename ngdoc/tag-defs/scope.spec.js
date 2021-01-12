const tagDefFactory = require('./scope');

describe("scope tag-def", () => {
  it("should transform the value to true", () => {
    const tagDef = tagDefFactory();
    expect(tagDef.transforms()).toEqual(true);
  });
});