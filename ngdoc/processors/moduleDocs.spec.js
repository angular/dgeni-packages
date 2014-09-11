var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("moduleDocsProcessor", function() {
  var processor, aliasMap, moduleMap;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('moduleDocsProcessor');
    moduleMap = injector.get('moduleMap');
    aliasMap = injector.get('aliasMap');
  });

  it("should compute the package name and filename for the module", function() {
    var doc1 = { docType: 'module', name: 'ng', id: 'module:ng' };
    var doc2 = { docType: 'module', name: 'ngRoute', id: 'module:ngRoute' };
    var doc3 = { docType: 'module', name: 'ngMock', id: 'module:ngMock', packageName: 'angular-mocks' };

    processor.$process([doc1, doc2, doc3]);

    expect(doc1.packageName).toEqual('angular');
    expect(doc1.packageFile).toEqual('angular.js');

    expect(doc2.packageName).toEqual('angular-route');
    expect(doc2.packageFile).toEqual('angular-route.js');

    expect(doc3.packageName).toEqual('angular-mocks');
    expect(doc3.packageFile).toEqual('angular-mocks.js');

  });

  it("should add module docs to the moduleMap", function() {
    var doc1 = { docType: 'module', id: 'ng' };
    var doc2 = { docType: 'module', id: 'ngMock' };
    var doc3 = { docType: 'service', module: 'ng', id: 'ng.$http' };

    processor.$process([doc1, doc2, doc3]);

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

  it("should complain if their is more than one matching modules", function() {
    var doc1 = { docType: 'module', id: 'module:app.mod1', aliases: ['app', 'app.mod1', 'mod1', 'module:app', 'module:app.mod1', 'module:mod1'] };
    var doc2 = { docType: 'module', id: 'module:app.mod2', aliases: ['app', 'app.mod2', 'mod2', 'module:app', 'module:app.mod2', 'module:mod2'] };
    var doc3 = { docType: 'service', module: 'app', id: 'app.service' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);

    expect(function() {
      processor.$process([doc1, doc2, doc3]);
    }).toThrowError('Ambiguous module reference: "app" - doc "app.service" (service) \n'+
                    'Matching modules:\n'+
                    '- module:app.mod1\n'+
                    '- module:app.mod2\n');

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