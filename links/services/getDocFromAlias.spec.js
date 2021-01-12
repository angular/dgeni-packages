const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

let getDocFromAlias, aliasMap;

describe("getDocFromAlias", () => {
  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    aliasMap = injector.get('aliasMap');
    getDocFromAlias = injector.get('getDocFromAlias');
  });

  it("should return an array of docs that match the alias", () => {
    const doc1 = { aliases: ['a','b','c'] };
    const doc2 = { aliases: ['a','b'] };
    const doc3 = { aliases: ['a'] };
    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);

    expect(getDocFromAlias('a')).toEqual([doc1, doc2, doc3]);
    expect(getDocFromAlias('b')).toEqual([doc1, doc2]);
    expect(getDocFromAlias('c')).toEqual([doc1]);
  });

  it("should return docs that match the alias and originating doc's area", () => {
    const doc1 = { aliases: ['a'], area: 'api'};
    const doc2 = { aliases: ['a'], area: 'api'};
    const doc3 = { aliases: ['a'], area: 'other'};
    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);

    expect(getDocFromAlias('a', {area: 'api'})).toEqual([doc1, doc2]);
  });

  it("should return docs that match the alias and originating doc's area and module", () => {
    const doc1 = { aliases: ['a'], area: 'api', module: 'ng'};
    const doc2 = { aliases: ['a'], area: 'api', module: 'ngMock'};
    const doc3 = { aliases: ['a'], area: 'other', module: 'ng'};
    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);

    expect(getDocFromAlias('a', {area: 'api', module:'ng'})).toEqual([doc1]);
  });
});