const transformFactory = require('./unknown-tag');

describe("unknown-tag transform", () => {
  it("should add an error to the tag if it has no tagDef", () => {
    const doc = {}, tag = { tagName: 'bad-tag'};
    const transform = transformFactory();
    transform(doc, tag);
    expect(tag.errors).toEqual(['Unknown tag: bad-tag']);
  });
});