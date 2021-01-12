const tagDefFactory = require('./element');

describe("element tag-def", () => {
  it("should set default based on docType", () => {

     const tagDef =  tagDefFactory();
     expect(tagDef.defaultFn({ docType: 'directive' })).toEqual('ANY');
     expect(tagDef.defaultFn({ docType: 'input' })).toEqual('ANY');
     expect(tagDef.defaultFn({ docType: 'service' })).toBeUndefined();

  });
});