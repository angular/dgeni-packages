import {Dgeni, DocCollection} from 'dgeni';
import {Injector} from 'dgeni/lib/injector';
import {ReadTypeScriptModules} from '.';
import {ClassExportDoc} from '../../api-doc-types/ClassExportDoc';
import {ExportDoc} from '../../api-doc-types/ExportDoc';
const mockPackage = require('../../mocks/mockPackage');
const path = require('canonical-path');

describe('readTypeScriptModules', () => {
  let dgeni: Dgeni;
  let injector: Injector;
  let processor: ReadTypeScriptModules;

  beforeEach(() => {
    dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();
    processor = injector.get('readTypeScriptModules');
    processor.basePath = path.resolve(__dirname, '../mocks/readTypeScriptModules');
  });

  describe('exportDocs', () => {

    it('should extract all content from the comments', () => {
      processor.sourceFiles = [ 'commentContent.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);
      const someClassDoc = docs.find(doc => doc.name === 'SomeClass');
      expect(someClassDoc.content).toEqual('@empty\n');

      const fooDoc = docs.find(doc => doc.name === 'foo');
      expect(fooDoc.content).toEqual('The description\n@tag1\ntag info\n');

      const barDoc = docs.find(doc => doc.name === 'bar');
      expect(barDoc.content).toEqual('@name bar\n@description\ndescription of bar {@inline-tag} more content\n');

    });

    it('should provide the original module if the export is re-exported', () => {
      processor.sourceFiles = [ 'publicModule.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const exportedDoc = docs[1];
      expect(exportedDoc.originalModule).toEqual('privateModule');
    });

    it('should include exported abstract classes', () => {
      processor.sourceFiles = [ 'publicModule.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const exportedDoc = docs[2];
      expect(exportedDoc.name).toEqual('AbstractClass');
    });

    it('should hide members marked as private in TypeScript', () => {
      processor.sourceFiles = [ 'privateMembers.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      expect(docs.every(doc => doc.name !== 'privateProperty')).toBe(true);
    });

    it('should put static members into the `.statics` property of the export doc', () => {
      processor.sourceFiles = [ 'staticMembers.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const classDoc: ClassExportDoc = docs.find(doc => doc.docType === 'class');
      expect(classDoc.statics.length).toEqual(2);
      expect(classDoc.statics.map(staticMember => staticMember.name)).toEqual(['staticA', 'num']);
      expect(classDoc.members.length).toEqual(0);
    });

    it('should add additional declarations of a symbol onto the exportDoc', () => {
      processor.sourceFiles = [ 'multipleDeclarations.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const someThingDoc = docs.find(doc => doc.name === 'SomeThing');
      expect(someThingDoc.docType).toEqual('interface');
      expect(someThingDoc.content).toEqual('constant\n');
      expect(someThingDoc.additionalDeclarations).toEqual([
        someThingDoc.exportSymbol.declarations[0],
      ]);
    });

    it('should remove `index` from the end of module ids and names', () => {
      processor.sourceFiles = [ 'test/folder/index.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      expect(moduleDoc.id).toEqual('test/folder');
      expect(moduleDoc.name).toEqual('folder');

      const exportDoc = docs[1];
      expect(exportDoc.id).toEqual('test/folder/TestClass');
      expect(exportDoc.name).toEqual('TestClass');
    });

  });

  xdescribe('ignoreExportsMatching', () => {
    it('should ignore exports that match items in the `ignoreExportsMatching` property', () => {
      processor.sourceFiles = [ 'ignoreExportsMatching.ts'];
      processor.ignoreExportsMatching = [/^_/];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      expect(moduleDoc.docType).toEqual('module');
      expect(moduleDoc.exports).toEqual([
        jasmine.objectContaining({ name: 'OKToExport' }),
        jasmine.objectContaining({ name: 'thisIsOK' }),
      ]);
    });

    it('should only ignore `___esModule` exports by default', () => {
      processor.sourceFiles = [ 'ignoreExportsMatching.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      expect(moduleDoc.docType).toEqual('module');
      expect(getNames(moduleDoc.exports)).toEqual([
        'OKToExport',
        '_thisIsPrivate',
        'thisIsOK',
      ]);
    });
  });

  xdescribe('interfaces', () => {

    it('should mark optional properties', () => {
      processor.sourceFiles = [ 'interfaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      const exportedInterface = moduleDoc.exports[0];
      const member = exportedInterface.members[0];
      expect(member.name).toEqual('optionalProperty');
      expect(member.optional).toEqual(true);
    });

    it('should handle "call" type interfaces', () => {
      processor.sourceFiles = [ 'interfaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      const exportedInterface = moduleDoc.exports[0];

      expect(exportedInterface.callMember).toBeDefined();
      expect(exportedInterface.callMember.parameters).toEqual(['param: T']);
      expect(exportedInterface.callMember.returnType).toEqual('U');
      expect(exportedInterface.callMember.typeParameters).toEqual(['T', 'U extends Findable<T>']);
      expect(exportedInterface.newMember).toBeDefined();
      expect(exportedInterface.newMember.parameters).toEqual(['param: number']);
      expect(exportedInterface.newMember.returnType).toEqual('MyInterface');
    });
  });

  xdescribe('type aliases', () => {
    it('should find the correct type when there are multiple declarations', () => {
      processor.sourceFiles = [ 'type-aliases.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const typeAliasDoc = docs[2];
      expect(typeAliasDoc.docType).toEqual('type-alias');
      expect(typeAliasDoc.typeDefinition).toEqual('X<any>');
    });
  });

  describe('overloaded members', () => {
    it('should create member docs for each overload', () => {
      processor.sourceFiles = [ 'overloadedMembers.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const fooDocs = docs.filter(doc => doc.name === 'foo');
      expect(fooDocs[0].parameters).toEqual(['str: string']);
      expect(fooDocs[1].parameters).toEqual(['num: number']);
      // console.log(fooDocs.map(doc => doc.name));
    });
  });

  xdescribe('ordering of members', () => {
    it('should order class members in order of appearance (by default)', () => {
      processor.sourceFiles = ['orderingOfMembers.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const classDoc = docs.find(doc => doc.docType === 'class');
      expect(classDoc.docType).toEqual('class');
      expect(getNames(classDoc.members)).toEqual([
        'firstItem',
        'otherMethod',
        'doStuff',
      ]);
    });

    it('should not order class members if not sortClassMembers is false', () => {
      processor.sourceFiles = ['orderingOfMembers.ts'];
      processor.sortClassMembers = false;
      const docs: DocCollection = [];
      processor.$process(docs);
      const classDoc = docs.find(doc => doc.docType === 'class');
      expect(classDoc.docType).toEqual('class');
      expect(getNames(classDoc.members)).toEqual([
        'firstItem',
        'otherMethod',
        'doStuff',
      ]);
    });
  });

  xdescribe('strip namespaces', () => {
    it('should strip namespaces in return types', () => {
      processor.sourceFiles = ['stripNamespaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc = docs.find(doc => doc.docType === 'function');
      expect(functionDoc.returnType).toEqual('IDirective');
    });

    it('should not strip ignored namespaces in return types', () => {
      const ignoreTypeScriptNamespaces = injector.get('ignoreTypeScriptNamespaces');
      ignoreTypeScriptNamespaces.push(/angular/);
      processor.sourceFiles = ['stripNamespaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc = docs.find(doc => doc.docType === 'function');
      expect(functionDoc.returnType).toEqual('angular.IDirective');
    });

    it('should cope with spread operator', () => {
      processor.sourceFiles = ['spreadParams.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc = docs.find(doc => doc.docType === 'function');
      expect(functionDoc.parameters).toEqual(['...args: Array<any>']);
      expect(functionDoc.returnType).toEqual('void');

      const interfaceDoc = docs.find(doc => doc.docType === 'interface');
      expect(interfaceDoc.members.length).toEqual(1);
      expect(interfaceDoc.members[0].parameters).toEqual(['...args: Array<any>']);
      expect(interfaceDoc.members[0].returnType).toEqual('void');
    });
  });

  xdescribe('source file globbing patterns', () => {
    it('should work with include patterns', () => {
      processor.sourceFiles = [
        {
          include: '*Module.ts',
        },
      ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDocs = docs.filter(doc => doc.docType === 'module');
      expect(moduleDocs.length).toBe(2);
      expect(moduleDocs[0].name).toEqual('privateModule');
      expect(moduleDocs[1].name).toEqual('publicModule');
    });

    it('should work with include/exclude patterns', () => {
      processor.sourceFiles = [
        {
          exclude: 'public*.ts',
          include: '*Module.ts',
        },
      ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      expect(moduleDoc.name).toEqual('privateModule');
    });
  });

  xdescribe('getReturnType', () => {
    it('should not throw if "declaration.initializer.expression.text" is undefined', () => {
      processor.sourceFiles = ['getReturnType.ts'];
      const docs: DocCollection = [];
      expect(() => { processor.$process(docs); }).not.toThrow();
    });

    it('should try get the type from the typeChecker if possible', () => {
      processor.sourceFiles = ['getReturnType.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const overriddenSomePropDoc = docs.pop();
      expect(overriddenSomePropDoc.returnType).toEqual('any');
    });
  });
});

function getNames(collection: Array<{name: string}>) {
  return collection.map(item => item.name);
}
