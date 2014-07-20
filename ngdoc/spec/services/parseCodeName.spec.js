var parseCodeNameFactory = require('../../services/parseCodeName');

describe("parseCodeName", function() {
  it("should parse a codeName into its parts", function() {
    var parseCodeName = parseCodeNameFactory();
    expect(parseCodeName('module:ng.service:$http#get')).toEqual([
      { modifier: 'module', name: 'ng' },
      { modifier: 'service', name: '$http#get' }
    ]);
  });
});