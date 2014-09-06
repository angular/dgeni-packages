var mockPackage = require('dgeni-packages/ngdoc/spec/mockPackage');
var Dgeni = require('dgeni');

describe("moduleDocsProcessor", function() {
  var processor, aliasMap;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('moduleDocsProcessor');
    moduleMap = injector.get('moduleMap');
    aliasMap = injector.get('aliasMap');
  });

  it("should add module docs to the moduleMap", function() {
    var doc1 = { docType: 'module', id: 'ng' };
    var doc2 = { docType: 'module', id: 'ngMock' };
    var doc3 = { docType: 'service', module: 'ng', id: 'ng.$http' };

    processor.$process([doc1, doc2]);

    expect(moduleMap.values().length).toEqual(2);
    expect(moduleMap.get('ng')).toBe(doc1);
    expect(moduleMap.get('ngMock')).toBe(doc2);
  });

  it("should connect all docs to their module", function() {
    var doc1 = { docType: 'module', id: 'ng', aliases: ['ng'] };
    var doc2 = { docType: 'module', id: 'ngMock', aliases: ['ngMock'] };
    var doc3 = { docType: 'service', module: 'ng', id: 'ng.$http' };
    var doc4 = { docType: 'service', module: 'ng', id: 'ng.$log' };
    var doc5 = { docType: 'service', module: 'ngMock', id: 'ng.$log' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    processor.$process([doc1, doc2, doc3, doc4, doc5]);

    expect(doc1.components).toEqual([doc3, doc4]);
    expect(doc2.components).toEqual([doc5]);

    expect(doc3.moduleDoc).toBe(doc1);
    expect(doc4.moduleDoc).toBe(doc1);
    expect(doc5.moduleDoc).toBe(doc2);

  });

  it("should try using the module specifier if the module reference is ambiguous", function() {
    var doc1 = { docType: 'module', id: 'module:ngMessages', aliases: ['ngMessages', 'module:ngMessages'] };
    var doc2 = { docType: 'directive', module:'ngMessages', id: 'module:ngMessages.directive:ngMessages', aliases: ['ngMessages.ngMessages', 'module:ngMessages.ngMessages', 'ngMessages.directive:ngMessages', 'module:ngMessages.directive:ngMessages', 'directive:ngMessages', 'ngMessages'] };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    processor.$process([doc1, doc2]);

    expect(doc2.moduleDoc).toBe(doc1);

  });

});