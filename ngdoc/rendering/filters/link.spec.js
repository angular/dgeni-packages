const filterFactory = require('./link');

describe("link filter", () => {
  let filter;

  beforeEach(() => {
    filter = filterFactory();
  });

  it("should have the name 'link'", () => {
    expect(filter.name).toEqual('link');
  });

  it("should inject an inline link tag", () => {
    expect(filter.process('URL', 'TITLE')).toEqual('{@link URL TITLE }');
  });

  it("should omit title when it is undefined", () => {
    expect(filter.process('URL', undefined)).toEqual('{@link URL  }');
  });

});
