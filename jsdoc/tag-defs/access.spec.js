var tagDefFactory = require('./access');

describe("access tagDef", () => {
  var extractAccessTransform;

  beforeEach(() => {
    extractAccessTransform = () => {};
  });

  it("should have the correct name", () => {
    var tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.name).toEqual('access');
  });

  it("should add the injected transforms to the transforms property", () => {
    var tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.transforms).toEqual(extractAccessTransform);
  });
});