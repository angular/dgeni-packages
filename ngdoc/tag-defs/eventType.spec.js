const tagDefFactory = require('./eventType');

describe("eventType tag-def", () => {
  it("should split into eventType and eventTarget", () => {
    const doc = {}, tag = {};
    const tagDef = tagDefFactory();
    const value = tagDef.transforms(doc, tag, 'broadcast on module:ng.directive:ngInclude');
    expect(value).toEqual('broadcast');
    expect(doc.eventTarget).toEqual('module:ng.directive:ngInclude');
  });
});