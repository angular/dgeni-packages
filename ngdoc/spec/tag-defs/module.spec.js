var tagDefFactory = require('../../tag-defs/module');

describe("module tag-def", function() {
  it("should calculate the module from the second segment of the file path", function() {
     var tagDef = tagDefFactory();
     expect(tagDef.defaultFn({ area: 'api', fileInfo: { filePath: 'api/ng/service/$http.js' } })).toEqual('ng');
  });
});