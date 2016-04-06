var tagDefFactory = require('./access');

describe("access tagDef", function() {

  it("should have correct name and property", function() {
    var tagDef = tagDefFactory();

    expect(tagDef.name).toEqual('access');
  });
});