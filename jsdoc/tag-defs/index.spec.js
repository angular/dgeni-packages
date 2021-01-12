const tagDefFactories = require('./');

describe("jsdoc tagdefs", () => {
  it("should contain an array of tagDef factory functions", () => {
    expect(tagDefFactories).toEqual(jasmine.any(Array));
    expect(tagDefFactories.length).toEqual(27);
    tagDefFactories.forEach(factory => expect(factory).toEqual(jasmine.any(Function)));
  });
});