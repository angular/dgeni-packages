const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("moduleDocsProcessor", () => {
  let processor, aliasMap, moduleMap;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('moduleDocsProcessor');
    moduleMap = injector.get('moduleMap');
    aliasMap = injector.get('aliasMap');
  });

  it("should compute the package name and filename for the module", () => {
    const doc1 = { docType: 'module', name: 'ng', id: 'module:ng' };
    const doc2 = { docType: 'module', name: 'ngRoute', id: 'module:ngRoute' };
    const doc3 = { docType: 'module', name: 'ngMock', id: 'module:ngMock', packageName: 'angular-mocks' };

    processor.$process([doc1, doc2, doc3]);

    expect(doc1.packageName).toEqual('angular');
    expect(doc1.packageFile).toEqual('angular.js');

    expect(doc2.packageName).toEqual('angular-route');
    expect(doc2.packageFile).toEqual('angular-route.js');

    expect(doc3.packageName).toEqual('angular-mocks');
    expect(doc3.packageFile).toEqual('angular-mocks.js');

  });

  it("should add module docs to the moduleMap", () => {
    const doc1 = { docType: 'module', id: 'ng' };
    const doc2 = { docType: 'module', id: 'ngMock' };
    const doc3 = { docType: 'service', module: 'ng', id: 'ng.$http' };

    processor.$process([doc1, doc2, doc3]);

    expect(moduleMap.size).toEqual(2);
    expect(moduleMap.get('ng')).toBe(doc1);
    expect(moduleMap.get('ngMock')).toBe(doc2);
  });

  it("should connect all docs to their module", () => {
    const doc1 = { docType: 'module', id: 'ng', aliases: ['ng'] };
    const doc2 = { docType: 'module', id: 'ngMock', aliases: ['ngMock'] };
    const doc3 = { docType: 'service', module: 'ng', id: 'ng.$http' };
    const doc4 = { docType: 'service', module: 'ng', id: 'ng.$log' };
    const doc5 = { docType: 'service', module: 'ngMock', id: 'ng.$log' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    processor.$process([doc1, doc2, doc3, doc4, doc5]);

    expect(doc1.components).toEqual([doc3, doc4]);
    expect(doc2.components).toEqual([doc5]);

    expect(doc3.moduleDoc).toBe(doc1);
    expect(doc4.moduleDoc).toBe(doc1);
    expect(doc5.moduleDoc).toBe(doc2);

  });

  it("should complain if their is more than one matching modules", () => {
    const doc1 = { docType: 'module', id: 'module:app.mod1', aliases: ['app', 'app.mod1', 'mod1', 'module:app', 'module:app.mod1', 'module:mod1'] };
    const doc2 = { docType: 'module', id: 'module:app.mod2', aliases: ['app', 'app.mod2', 'mod2', 'module:app', 'module:app.mod2', 'module:mod2'] };
    const doc3 = { docType: 'service', module: 'app', id: 'app.service' };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);

    expect(() => processor.$process([doc1, doc2, doc3]))
        .toThrowError('Ambiguous module reference: "app" - doc "app.service" (service) \n'+
                    'Matching modules:\n'+
                    '- module:app.mod1\n'+
                    '- module:app.mod2\n');

  });

  it("should try using the module specifier if the module reference is ambiguous", () => {
    const doc1 = { docType: 'module', id: 'module:ngMessages', aliases: ['ngMessages', 'module:ngMessages'] };
    const doc2 = { docType: 'directive', module:'ngMessages', id: 'module:ngMessages.directive:ngMessages', aliases: ['ngMessages.ngMessages', 'module:ngMessages.ngMessages', 'ngMessages.directive:ngMessages', 'module:ngMessages.directive:ngMessages', 'directive:ngMessages', 'ngMessages'] };

    aliasMap.addDoc(doc1);
    aliasMap.addDoc(doc2);
    processor.$process([doc1, doc2]);

    expect(doc2.moduleDoc).toBe(doc1);

  });

  it("should throw an error if a module is documented as another type of entity", () => {
    const doc1 = { docType: 'object', name: 'mod2', id: 'object:mod2', aliases: ['mod2', 'object:mod2'] };
    const doc2 = { docType: 'service', name: 'service1', module: 'mod1', id: 'mod1.service1' };
    const doc3 = { docType: 'service', name: 'service2', module: 'mod2', id: 'mod2.service2' };

    aliasMap.addDoc(doc1);

    expect(() => processor.$process([doc1, doc2, doc3]))
        .toThrowError('"mod2" is not a module. It is documented as "object". Either the module is incorrectly typed or the module reference is invalid - doc "mod2.service2" (service) ');

  });

});
