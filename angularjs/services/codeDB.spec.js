var codeDBFactory = require('./codeDB');

describe("codeDB service", function() {
  var codeDB;
  beforeEach(function() {
    codeDB = codeDBFactory();
  });
  it("should contain an array called moduleRefs", function() {
    expect(codeDB.moduleRefs).toEqual([]);
  });
});