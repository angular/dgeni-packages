var filterFactory = require('./type-class');

describe("type-class filter", () => {
  it("should call getTypeClass", () => {
    var getTypeClassSpy = jasmine.createSpy('getTypeClass');
    var filter = filterFactory(getTypeClassSpy);

    filter.process('object');
    expect(getTypeClassSpy).toHaveBeenCalled();
  });
});