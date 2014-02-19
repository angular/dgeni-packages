var filter = require('../../../rendering/filters/link');

describe("link filter", function() {

  it("should have the name 'link'", function() {
    expect(filter.name).toEqual('link');
  });

  it("should inject an inline link tag", function() {
    expect(filter.process('URL', 'TITLE')).toEqual('{@link URL TITLE }');
  });

});