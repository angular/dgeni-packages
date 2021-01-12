const tagDefFactory = require('./area');

describe("area tag-def", () => {
  it("should set default based on fileType", () => {
     const tagDef =  tagDefFactory();
     expect(tagDef.defaultFn({ fileInfo: { extension: 'js' } })).toEqual('api');
     expect(tagDef.defaultFn({ fileInfo: { relativePath: 'guide/concepts.ngdoc' } })).toEqual('guide');
  });
});