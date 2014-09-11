var filter = require('./first-line');

describe("firstLine filter", function() {
  it("should have the name 'firstLine'", function() {
    expect(filter.name).toEqual('firstLine');
  });
  it("should return the content up to the first newline", function() {
    expect(filter.process('this is a line\nthis is another line')).toEqual('this is a line');
  });
});

