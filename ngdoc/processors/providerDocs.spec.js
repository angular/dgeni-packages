const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("providerDocsProcessor", () => {
  let processor, aliasMap, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('providerDocsProcessor');
    aliasMap = injector.get('aliasMap');
    mockLog = injector.get('log');
  });


  it("should connect all services docs to their provider docs", () => {
    const doc1 = { docType: 'provider', id: 'provider:$httpProvider', aliases: ['provider:$httpProvider'] };
    const doc2 = { docType: 'provider', id: 'provider:$logProvider', aliases: ['provider:$logProvider'] };
    const doc3 = { docType: 'service', id: 'service:$http', aliases: ['service:$http'] };
    const doc4 = { docType: 'service', id: 'service:$log', aliases: ['service:$log'] };
    const doc5 = { docType: 'service', id: 'service:$filter', aliases: ['service:$filter'] };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);
    aliasMap.addDoc(doc4);
    aliasMap.addDoc(doc5);

    processor.$process([doc1, doc2, doc3, doc4, doc5]);

    expect(doc1.serviceDoc).toBe(doc3);
    expect(doc2.serviceDoc).toBe(doc4);
    expect(doc3.providerDoc).toBe(doc1);
    expect(doc4.providerDoc).toBe(doc2);
    expect(doc5.providerDoc).toBeUndefined();

  });


  it("should log a warning if their is more than one matching service", () => {
    const doc1 = { docType: 'provider', id: 'provider:$httpProvider', aliases: ['provider:$httpProvider'] };
    const doc2 = { docType: 'service', id: 'service:$http', aliases: ['service:$http'] };
    const doc3 = { docType: 'service', id: 'service:$http', aliases: ['service:$http'] };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    aliasMap.addDoc(doc3);

    processor.$process([doc1, doc2, doc3]);
    expect(mockLog.warn).toHaveBeenCalledWith(
        'Ambiguous service name "service:$http" for provider - doc "provider:$httpProvider" (provider) \n'+
        'Matching docs: \n'+
        '  "service:$http"\n'+
        '  "service:$http"');
  });


  it("should complain if there is no service for a provider", () => {
    const doc1 = { docType: 'provider', id: 'provider:$httpProvider', aliases: ['provider:$httpProvider'] };

    aliasMap.addDoc(doc1);

    processor.$process([doc1]);
    expect(mockLog.warn).toHaveBeenCalledWith(
        'Missing service "service:$http" for provider - doc "provider:$httpProvider" (provider) ');
  });
});