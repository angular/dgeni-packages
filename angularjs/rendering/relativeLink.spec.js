var filterFactory = require('./relativeLink');


describe("relativeLink nunjucks filter", function() {
  var filter;

  beforeEach(function() {
    filter = filterFactory();
  });


  it("should return an HTML anchor if the doc contains a path", function() {
    expect(filter.process({ path: 'x/y', name:'xy' })).toEqual('<a href="x/y">xy</a>');
  });

  it("should just return the doc if it has no path", function() {
    expect(filter.process({ })).toEqual({});
  });

  it("should use the title parameter if given", function() {
    expect(filter.process({ path: 'x/y', name:'xy' }, null, 'aTitle')).toEqual('<a href="x/y">aTitle</a>');
  });

  it("should return a relative path if an originating document is provided", function() {
    expect(filter.process({ path: 'x/y', name:'xy' }, { path: 'x/z' })).toEqual('<a href="../y">xy</a>');
  });
});