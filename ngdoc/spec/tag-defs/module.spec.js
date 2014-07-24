var path = require('canonical-path');
var tagDefFactory = require('../../tag-defs/module');

describe("module tag-def", function() {
  it("should calculate the module from the second segment of the file path", function() {
     var tagDef = tagDefFactory();
     expect(tagDef.defaultFn({ area: 'api', fileInfo: { relativePath: 'ng/service/$http.js' } })).toEqual('ng');
  });

  it("should use the relative file path", function() {
     var tagDef = tagDefFactory();
     var relativePath = 'ng/service/$http.js';
     expect(tagDef.defaultFn({ area: 'api', fileInfo: { filePath: path.resolve(relativePath), relativePath: relativePath } })).toEqual('ng');
  });
});