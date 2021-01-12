const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("unescapeCommentsProcessor", () => {
  it("should convert HTML encoded comments back to their original form", () => {

    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    const processor = injector.get('unescapeCommentsProcessor');

    const doc = {
      renderedContent: 'Some text containing /&amp;#42; a comment &amp;#42;/\nSome text containing /&amp;#42; a comment &amp;#42;/'
    };
    processor.$process([doc]);
    expect(doc.renderedContent).toEqual('Some text containing /* a comment */\nSome text containing /* a comment */');
  });
});