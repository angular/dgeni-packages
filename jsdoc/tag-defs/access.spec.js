var tagDefFactory = require('./access');

describe("access tagDef", function() {
  var accessTagTransform;
  var trimWhitespaceTransform = function() {};

  beforeEach(function() {
    accessTagTransform = function() {};
    accessTagTransform.addTag = jasmine.createSpy('addTag');
    accessTagTransform.addValue = jasmine.createSpy('addValue');
  });

  it("should have correct name and property", function() {
    var tagDef = tagDefFactory(accessTagTransform, trimWhitespaceTransform);

    expect(tagDef.name).toEqual('access');
    expect(tagDef.docProperty).toEqual('access');
  });

  it("should add the injected transforms to the transforms property", function() {
    var tagDef = tagDefFactory(accessTagTransform, trimWhitespaceTransform);

    expect(tagDef.transforms).toEqual([trimWhitespaceTransform, accessTagTransform]);
  });

  it("should record itself in accessTagTransform service", function() {
    tagDefFactory(accessTagTransform);

    expect(accessTagTransform.addTag.calls.count()).toEqual(1);
    expect(accessTagTransform.addValue.calls.count()).toEqual(3);
    expect(accessTagTransform.addTag).toHaveBeenCalledWith('access');
    expect(accessTagTransform.addValue.calls.allArgs()).toEqual([ ['private'], ['protected'], ['public'] ]);
  });

});