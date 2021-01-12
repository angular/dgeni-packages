const filters = require('./change-case');

const dashCase = filters.find(filter => filter.name === 'dashCase');

describe("dashCase custom filter", () => {
  it("should have the name 'dashCase'", () => {
    expect(dashCase.name).toEqual('dashCase');
  });
  it("should transform the content to dash-case", () => {
    expect(dashCase.process('fooBar')).toEqual('foo-bar');
  });
});

