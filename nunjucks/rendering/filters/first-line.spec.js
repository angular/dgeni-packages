var filter = require('./first-line');

describe("firstLine filter", function() {
  it("should have the name 'firstLine'", function() {
    expect(filter.name).toEqual('firstLine');
  });
  it("should return the content up to the first newline", function() {
    expect(filter.process('this is a line\nthis is another line')).toEqual('this is a line');
  });
  it("should return the contents until inline-tag closes", function() {
    expect(filter.process('this is a {@link\ninline-tag} this is another line')).toEqual('this is a {@link inline-tag}');
  });
});

