var getAliasesFactory = require('../../services/getAliases');

describe("getAliases", function() {

  it("should extract all the parts from a code name", function() {

    var getAliases = getAliasesFactory();

    var parts = [
      { modifier: 'module', name: 'ng' },
      { modifier: 'service', name: '$http#get' }
    ];

    expect(getAliases(parts)).toEqual([
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
