var filterFactory = require('../../../rendering/filters/type-class');

describe("type-class filter", function() {
  it("should call getTypeClass", function() {
    var getTypeClassSpy = jasmine.createSpy('getTypeClass');
    var filter = filterFactory(getTypeClassSpy);

    filter.process('object');
    expect(getTypeClassSpy).toHaveBeenCalled();
  });
});