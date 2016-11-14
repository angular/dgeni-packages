var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var path = require('canonical-path');
var _ = require('lodash');

describe('readTypeScriptModules', function() {
  var dgeni, injector, processor;

  beforeEach(function() {
    dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();
    processor = injector.get('readTypeScriptModules');
    processor.basePath = path.resolve(__dirname, '../mocks/readTypeScriptModules');
  });

  describe('exportDocs', function() {
    it('should provide the original module if the export is re-exported', function() {
      processor.sourceFiles = [ 'publicModule.ts' ];
      var docs = [];
      processor.$process(docs);

      var exportedDoc = docs[1];
      expect(exportedDoc.originalModule).toEqual('privateModule');
    });

    it('should include exported abstract classes', function() {
      processor.sourceFiles = [ 'publicModule.ts' ];
      var docs = [];
      processor.$process(docs);

      var exportedDoc = docs[2];
      expect(exportedDoc.name).toEqual('AbstractClass');
    });

    it('should exclude private exports', function() {
      processor.sourceFiles = [ 'privateExports.ts' ];
      var docs = [];
      processor.$process(docs);

      expect(docs.length).toBe(2);
      expect(docs[1].name).toEqual('x');
    });

    it('should include private exports if flag hidePrivateMembers is false', function() {
      processor.sourceFiles = [ 'privateExports.ts' ];
      processor.hidePrivateMembers = false;
      var docs = [];
      processor.$process(docs);

      expect(docs.length).toBe(4);
      expect(docs[1].name).toEqual('x');
      expect(docs[1].shouldHideExport).toBe(false);
      expect(docs[2].name).toEqual('y');
      expect(docs[2].shouldHideExport).toBe(true);
      expect(docs[3].name).toEqual('z');
      expect(docs[3].shouldHideExport).toBe(true);
    });

    it('should hide members marked as private in TypeScript', function() {
      processor.sourceFiles = [ 'privateMembers.ts' ];
      var docs = [];
      processor.$process(docs);

      expect(docs.every(function(doc) { return doc.name !== 'privateProperty'; })).toBe(true);
    });


    it('should create add additional declarations of a symbol onto the exportDoc', function() {
      processor.sourceFiles = [ 'multipleDeclarations.ts' ];
      var docs = [];
      processor.$process(docs);

      var someThingDoc = docs[3];
      expect(someThingDoc.name).toEqual('SomeThing');
      expect(someThingDoc.docType).toEqual('interface');
      expect(someThingDoc.content).toEqual('constant\n');
      expect(someThingDoc.additionalDeclarations).toEqual([
        someThingDoc.exportSymbol.declarations[0]
      ]);
    });

  });


  describe('ignoreExportsMatching', function() {
    it('should ignore exports that match items in the `ignoreExportsMatching` property', function() {
      processor.sourceFiles = [ 'ignoreExportsMatching.ts'];
      processor.ignoreExportsMatching = [/^_/];
      var docs = [];
      processor.$process(docs);

      var moduleDoc = docs[0];
      expect(moduleDoc.docType).toEqual('module');
      expect(moduleDoc.exports).toEqual([
        jasmine.objectContaining({ name: 'OKToExport' }),
        jasmine.objectContaining({ name: 'thisIsOK' })
      ]);
    });

    it('should only ignore `___esModule` exports by default', function() {
      processor.sourceFiles = [ 'ignoreExportsMatching.ts'];
      var docs = [];
      processor.$process(docs);

      var moduleDoc = docs[0];
      expect(moduleDoc.docType).toEqual('module');
      expect(getNames(moduleDoc.exports)).toEqual([
        'OKToExport',
        '_thisIsPrivate',
        'thisIsOK'
      ]);
    });
  });


  describe('interfaces', function() {

    it('should mark optional properties', function() {
      processor.sourceFiles = [ 'interfaces.ts'];
      var docs = [];
      processor.$process(docs);

      var moduleDoc = docs[0];
      var exportedInterface = moduleDoc.exports[0];
      var member = exportedInterface.members[0];
      expect(member.name).toEqual('optionalProperty');
      expect(member.optional).toEqual(true);
    });


    it('should handle "call" type interfaces', function() {
      processor.sourceFiles = [ 'interfaces.ts'];
      var docs = [];
      processor.$process(docs);

      var moduleDoc = docs[0];
      var exportedInterface = moduleDoc.exports[0];

      expect(exportedInterface.callMember).toBeDefined();
      expect(exportedInterface.callMember.parameters).toEqual(['param: T']);
      expect(exportedInterface.callMember.returnType).toEqual('U');
      expect(exportedInterface.callMember.typeParameters).toEqual(['T', 'U extends Findable<T>']);
      expect(exportedInterface.newMember).toBeDefined();
      expect(exportedInterface.newMember.parameters).toEqual(['param: number']);
      expect(exportedInterface.newMember.returnType).toEqual('MyInterface');
    });
  });


  describe('ordering of members', function() {
    it('should order class members in order of appearance (by default)', function() {
      processor.sourceFiles = ['orderingOfMembers.ts'];
      var docs = [];
      processor.$process(docs);
      var classDoc = _.find(docs, { docType: 'class' });
      expect(classDoc.docType).toEqual('class');
      expect(getNames(classDoc.members)).toEqual([
        'firstItem',
        'otherMethod',
        'doStuff',
      ]);
    });


    it('should not order class members if not sortClassMembers is false', function() {
      processor.sourceFiles = ['orderingOfMembers.ts'];
      processor.sortClassMembers = false;
      var docs = [];
      processor.$process(docs);
      var classDoc = _.find(docs, { docType: 'class' });
      expect(classDoc.docType).toEqual('class');
      expect(getNames(classDoc.members)).toEqual([
        'firstItem',
        'otherMethod',
        'doStuff'
      ]);
    });
  });

  describe('strip namespaces', function () {
    it('should strip namespaces in return types', function () {
      processor.sourceFiles = ['stripNamespaces.ts'];
      var docs = [];
      processor.$process(docs);
      var functionDoc = _.find(docs, { docType: 'function' });
      expect(functionDoc.returnType).toEqual('IDirective');
    });

    it('should not strip ignored namespaces in return types', function () {
      var ignoreTypeScriptNamespaces = injector.get('ignoreTypeScriptNamespaces');
      ignoreTypeScriptNamespaces.push(/angular/);
      processor.sourceFiles = ['stripNamespaces.ts'];
      var docs = [];
      processor.$process(docs);
      var functionDoc = _.find(docs, { docType: 'function' });
      expect(functionDoc.returnType).toEqual('angular.IDirective');
    });
  });

  describe('source file globbing patterns', function() {
    it('should work with include patterns', function () {
      processor.sourceFiles = [
        {
          include: '*Module.ts'
        }
      ];
      var docs = [];
      processor.$process(docs);

      var moduleDocs = _.filter(docs, { docType: 'module' });
      expect(moduleDocs.length).toBe(2);
      expect(moduleDocs[0].name).toEqual('privateModule');
      expect(moduleDocs[1].name).toEqual('publicModule');
    });

    it('should work with include/exclude patterns', function () {
      processor.sourceFiles = [
        {
          include: '*Module.ts',
          exclude: 'public*.ts'
        }
      ];
      var docs = [];
      processor.$process(docs);

      var moduleDoc = docs[0];
      expect(moduleDoc.name).toEqual('privateModule');
    });
  });

  describe('getReturnType', function () {
    it('should not throw if "declaration.initializer.expression.text" is undefined', function () {
      processor.sourceFiles = ['getReturnType.ts'];
      var docs = [];
      expect(function () { processor.$process(docs); }).not.toThrow();
    });

    it('should try get the type from the typeChecker if possible', function () {
      processor.sourceFiles = ['getReturnType.ts'];
      var docs = [];
      processor.$process(docs);

      var overriddenSomePropDoc = _.last(docs);
      expect(overriddenSomePropDoc.returnType).toEqual('any');
    });
  });
});

function getNames(collection) {
  return collection.map(function(item) { return item.name; });
}
