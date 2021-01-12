const path = require('canonical-path');
const tagDefFactory = require('./module');

describe("module tag-def", () => {
  it("should calculate the module from the second segment of the file path", () => {
     const tagDef = tagDefFactory();
     expect(tagDef.defaultFn({ area: 'api', fileInfo: { relativePath: 'ng/service/$http.js' } })).toEqual('ng');
  });

  it("should use the relative file path", () => {
     const tagDef = tagDefFactory();
     const relativePath = 'ng/service/$http.js';
     expect(tagDef.defaultFn({ area: 'api', fileInfo: { filePath: path.resolve(relativePath), relativePath: relativePath } })).toEqual('ng');
  });

  it("should not calculate module if the doc is not in 'api' area", () => {
     const tagDef = tagDefFactory();
     const relativePath = 'guide/concepts.ngdoc';
     expect(tagDef.defaultFn({ area: 'guide', fileInfo: { filePath: path.resolve(relativePath), relativePath: relativePath } })).toBeUndefined();
  });

  it("should not calculate module if the doc has docType 'overview'", () => {
     const tagDef = tagDefFactory();
     const relativePath = 'api/index.ngdoc';
     expect(tagDef.defaultFn({ docType: 'overview', area: 'api', fileInfo: { filePath: path.resolve(relativePath), relativePath: relativePath } })).toBeUndefined();
  });
});