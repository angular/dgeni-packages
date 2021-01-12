const filters = require('./change-case');
const _ = require('lodash');

const dashCase = _.find(filters, filter => filter.name === 'dashCase');

describe("dashCase custom filter", () => {
  it("should have the name 'dashCase'", () => {
    expect(dashCase.name).toEqual('dashCase');
  });
  it("should transform the content to dash-case", () => {
    expect(dashCase.process('fooBar')).toEqual('foo-bar');
  });
});

