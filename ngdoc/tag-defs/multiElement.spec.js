var tagDefFactory = require('./multiElement');

describe("scope tag-def", () => {
  it("should transform the value to true", () => {
    var tagDef = tagDefFactory();
    expect(tagDef.transforms()).toEqual(true);
  });
});
