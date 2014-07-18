var transform = require('../../../tag-defs/transforms/unknown-tag');

describe("unknown-tag transform", function() {
  it("should add an error to the tag if it has no tagDef", function() {
    var doc = {}, tag = { tagName: 'bad-tag'};
    transform(doc, tag);
    expect(tag.errors).toEqual(['Unknown tag: bad-tag']);
  });
});