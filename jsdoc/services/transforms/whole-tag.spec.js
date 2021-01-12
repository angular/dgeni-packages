var transformFactory = require('./whole-tag');

describe("whole-tag transform", () => {
  it("should return the whole tag", () => {
    var transform = transformFactory();
    var doc = {}, tag = {}, value = {};
    expect(transform(doc, tag, value)).toBe(tag);
  });
});