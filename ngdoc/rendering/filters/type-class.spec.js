const filterFactory = require('./type-class');

describe("type-class filter", () => {
  it("should call getTypeClass", () => {
    const getTypeClassSpy = jasmine.createSpy('getTypeClass');
    const filter = filterFactory(getTypeClassSpy);

    filter.process('object');
    expect(getTypeClassSpy).toHaveBeenCalled();
  });
});