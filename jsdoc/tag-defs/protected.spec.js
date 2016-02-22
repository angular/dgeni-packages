var tagDefFactory = require('./protected');

describe("protected tagDef", function() {
  var accessTagTransform;

  beforeEach(function() {
    accessTagTransform = function() {};
    accessTagTransform.addTag = jasmine.createSpy('addTag');
    accessTagTransform.addValue = jasmine.createSpy('addValue');
  });

  it("should have correct name and property", function() {
    var tagDef = tagDefFactory(accessTagTransform);

    expect(tagDef.name).toEqual('protected');
    expect(tagDef.docProperty).toEqual('access');
  });

  it("should add the injected transforms to the transforms property", function() {
    var tagDef = tagDefFactory(accessTagTransform);

    expect(tagDef.transforms).toEqual([jasmine.any(Function), accessTagTransform]);
  });

  it("should record itself in accessTagTransform service", function() {
    tagDefFactory(accessTagTransform);

    expect(accessTagTransform.addTag.calls.count()).toEqual(1);
    expect(accessTagTransform.addValue.calls.count()).toEqual(1);
    expect(accessTagTransform.addTag).toHaveBeenCalledWith('protected');
    expect(accessTagTransform.addValue).toHaveBeenCalledWith('protected');
  });

  it("should set value to 'protected' and ignore anything came from document", function () {
    tagDef = tagDefFactory(accessTagTransform);

    expect(tagDef.transforms[0](null, {}, null)).toEqual('protected');
  });
});