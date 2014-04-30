var processor = require('../../processors/escaped-comments');

describe("escaped-comments doc processor", function() {
  it("should convert HTML encoded comments back to their original form", function() {
    var doc = {
      renderedContent: 'Some text containing /&amp;#42; a comment &amp;#42;/\nSome text containing /&amp;#42; a comment &amp;#42;/'
    };
    processor.process([doc]);
    expect(doc.renderedContent).toEqual('Some text containing /* a comment */\nSome text containing /* a comment */');
  });
});