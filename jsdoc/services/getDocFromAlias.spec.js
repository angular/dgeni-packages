var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var getDocFromAlias, aliasMap;

describe("getDocFromAlias", function() {
  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    aliasMap = injector.get('aliasMap');
    getDocFromAlias = injector.get('getDocFromAlias');
  });

  it("should return an array of docs that match the alias", function() {
    var doc1 = { aliases: ['a','b','c'] };
    var doc2 = { aliases: ['a','b'] };
    var doc3 = { aliases: ['a'] };
    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);

    expect(getDocFromAlias('a')).toEqual([doc1, doc2, doc3]);
    expect(getDocFromAlias('b')).toEqual([doc1, doc2]);
    expect(getDocFromAlias('c')).toEqual([doc1]);
  });


  it("should return docs that match the alias and originating doc's module", function() {
    var doc1 = { aliases: ['a'], module: 'ng'};
    var doc2 = { aliases: ['a'], module: 'ngMock'};
    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    expect(getDocFromAlias('a', {module:'ng'})).toEqual([doc1]);
  });
});