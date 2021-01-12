const getAliasesFactory = require('./getAliases');

describe("getAliases", () => {

  it("should extract all the parts from a code name", () => {

    const getAliases = getAliasesFactory();

    expect(getAliases({ id: 'module:ng.service:$http#get'})).toEqual([
      '$http#get',
      'service:$http#get',
      'ng.$http#get',
      'module:ng.$http#get',
      'ng.service:$http#get',
      'module:ng.service:$http#get',
      'get'
    ]);
  });
});
