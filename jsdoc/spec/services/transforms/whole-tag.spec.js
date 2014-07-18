var transform = require('../../../services/transforms/whole-tag');

describe("whole-tag transform", function() {
  it("should return the whole tag", function() {
    var doc = {}, tag = {}, value = {};
    expect(transform(doc, tag, value)).toBe(tag);
  });
});