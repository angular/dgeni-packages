var tagDefFactory = require('./access');

describe("access tagDef", function() {
  var extractAccessTransform;

  beforeEach(function() {
    extractAccessTransform = function() {};
  });

  it("should have the correct name", function() {
    var tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.name).toEqual('access');
  });

  it("should add the injected transforms to the transforms property", function() {
    var tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.transforms).toEqual(extractAccessTransform);
  });
});