var tagDefFactory = require('./private');

describe("private tagDef", function() {
  var accessTagTransform;

  beforeEach(function() {
    accessTagTransform = jasmine.createSpy('transform');
    accessTagTransform.addTag = jasmine.createSpy('addTag');
    accessTagTransform.addValue = jasmine.createSpy('addValue');
  });

  it("should have correct name and property", function() {
    var tagDef = tagDefFactory(accessTagTransform);

    expect(tagDef.name).toEqual('private');
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
    expect(accessTagTransform.addTag).toHaveBeenCalledWith('private');
    expect(accessTagTransform.addValue).toHaveBeenCalledWith('private');
  });

  it("should set value to 'private' and ignore anything came from document", function () {
    tagDef = tagDefFactory(accessTagTransform);

    expect(tagDef.transforms[0](null, {}, null)).toEqual('private');
  });
});