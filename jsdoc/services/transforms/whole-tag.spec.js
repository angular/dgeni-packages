const transformFactory = require('./whole-tag');

describe("whole-tag transform", () => {
  it("should return the whole tag", () => {
    const transform = transformFactory();
    const doc = {}, tag = {}, value = {};
    expect(transform(doc, tag, value)).toBe(tag);
  });
});