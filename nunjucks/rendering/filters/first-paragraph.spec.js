var filter = require('./first-paragraph');

describe("firstParagraph filter", () => {
  it("should have the name 'firstParagraph'", () => {
    expect(filter.name).toEqual('firstParagraph');
  });
  it("should return the content up to end of the first paragraph", () => {
    expect(filter.process('this is a line\nthis is another line\n\nthis is new paragraph'))
        .toEqual('this is a line\nthis is another line');
  });
});

