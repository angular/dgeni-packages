const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("memberDocsProcessor", () => {
  let processor, aliasMap, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('memberDocsProcessor');
    aliasMap = injector.get('aliasMap');
    mockLog = injector.get('log');
  });

  it("should remove docs that are members of container docs", () => {

    const doc1 = { id: 'module:ng.service:$log', aliases: ['$log', 'service:$log', 'ng.$log', 'module:ng.service:$log', 'ng.service:$log'] };
    const doc2 = { id: 'module:ngMock.service:$log', aliases: ['$log', 'service:$log', 'ngMock.$log', 'module:ngMock.service:$log', 'ngMock.service:$log'] };
    const doc3 = { id: 'ng.$log#warn' };
    let docs = [doc1, doc2, doc3];

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    docs = processor.$process(docs);

    expect(docs).toEqual([doc1,doc2]);

  });

  it("should connect member docs to their container doc", () => {

    const doc1 = { id: 'module:ng.service:$log', aliases: ['$log', 'service:$log', 'ng.$log', 'module:ng.service:$log', 'ng.service:$log'] };
    const doc2 = { id: 'module:ngMock.service:$log', aliases: ['$log', 'service:$log', 'ngMock.$log', 'module:ngMock.service:$log', 'ngMock.service:$log'] };
    const doc3 = { id: 'ng.$log#warn', docType: 'method' };
    const docs = [doc1, doc2, doc3];

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    processor.$process(docs);

    expect(doc3.name).toEqual('warn');
    expect(doc3.memberof).toEqual('module:ng.service:$log');
    expect(doc1.methods).toEqual([doc3]);
    expect(doc2.methods).not.toEqual([doc3]);

  });

  it("should attempt to match the container by using the member's module", () => {
    const doc1 = { module: 'ng', id: 'module:ng.service:$log', aliases: ['$log', 'service:$log', 'ng.$log', 'module:ng.service:$log', 'ng.service:$log'] };
    const doc2 = { module: 'ngMock', id: 'module:ngMock.service:$log', aliases: ['$log', 'service:$log', 'ngMock.$log', 'module:ngMock.service:$log', 'ngMock.service:$log'] };
    const doc3 = { module: 'ngMock', id: '$log#warn', docType: 'method' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);

    processor.$process([doc3]);
    expect(doc3.memberof).toEqual('module:ngMock.service:$log');
    expect(doc2.methods).toEqual([doc3]);
    expect(doc1.methods).not.toEqual([doc3]);

  });

  it("should warn if the container doc does not exist or is ambiguous", () => {

    const doc1 = { module: 'ng', id: 'module:ng.service:orderBy', aliases: ['orderBy', 'service:orderBy', 'ng.orderBy', 'module:ng.service:orderBy', 'ng.service:orderBy'] };
    const doc2 = { module: 'ng', id: 'module:ng.filter:orderBy', aliases: ['orderBy', 'filter:orderBy', 'ng.orderBy', 'module:ng.filter:orderBy', 'ng.service:orderBy'] };
    const doc3 = { module: 'ng', id: 'ng.$http#get', docType: 'method' };
    const doc4 = { module: 'ng', id: 'orderBy#doIt', docType: 'method' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);

    processor.$process([doc3]);
    expect(mockLog.warn).toHaveBeenCalled();
    expect(mockLog.warn.calls.mostRecent().args[0]).toMatch(/Missing container document/);
    mockLog.warn.calls.reset();

    processor.$process([doc4]);
    expect(mockLog.warn).toHaveBeenCalled();
    expect(mockLog.warn.calls.mostRecent().args[0]).toMatch(/Ambiguous container document reference/);

  });
});