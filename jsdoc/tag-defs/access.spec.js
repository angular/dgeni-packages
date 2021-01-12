const tagDefFactory = require('./access');

describe("access tagDef", () => {
  let extractAccessTransform;

  beforeEach(() => {
    extractAccessTransform = () => {};
  });

  it("should have the correct name", () => {
    const tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.name).toEqual('access');
  });

  it("should add the injected transforms to the transforms property", () => {
    const tagDef = tagDefFactory(extractAccessTransform);
    expect(tagDef.transforms).toEqual(extractAccessTransform);
  });
});