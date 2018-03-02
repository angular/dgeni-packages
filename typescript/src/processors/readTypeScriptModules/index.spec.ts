import {Dgeni, DocCollection} from 'dgeni';
import {Injector} from 'dgeni/lib/Injector';
import { Symbol } from 'typescript';
import {ReadTypeScriptModules} from '.';
import {AccessorInfoDoc} from '../../api-doc-types/AccessorInfoDoc';
import {ClassExportDoc} from '../../api-doc-types/ClassExportDoc';
import {ExportDoc} from '../../api-doc-types/ExportDoc';
import {FunctionExportDoc} from '../../api-doc-types/FunctionExportDoc';
import {InterfaceExportDoc} from '../../api-doc-types/InterfaceExportDoc';
import {MethodMemberDoc} from '../../api-doc-types/MethodMemberDoc';
import {ModuleDoc} from '../../api-doc-types/ModuleDoc';
import {ParameterDoc} from '../../api-doc-types/ParameterDoc';
import {PropertyMemberDoc} from '../../api-doc-types/PropertyMemberDoc';
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
    processor.basePath = path.resolve(__dirname, '../../mocks/readTypeScriptModules');
  });

  describe('exportDocs', () => {

    it('should extract all content from the comments', () => {
      processor.sourceFiles = [ 'commentContent.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);
      const someClassDoc = docs.find(doc => doc.name === 'SomeClass');
      expect(someClassDoc.content).toEqual('@empty');

      const fooDoc = docs.find(doc => doc.name === 'foo');
      expect(fooDoc.content).toEqual('The description\n@tag1\ntag info');

      const barDoc = docs.find(doc => doc.name === 'bar');
      expect(barDoc.content).toEqual('@name bar\n@description\ndescription of bar {@inline-tag} more content');
    });

    it('should extract the starting and ending lines from the comments', () => {
      processor.sourceFiles = [ 'commentContent.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);
      const someClassDoc = docs.find(doc => doc.name === 'SomeClass') as ClassExportDoc;
      expect(someClassDoc.startingLine).toEqual(0);
      expect(someClassDoc.endingLine).toEqual(17);

      const fooDoc = docs.find(doc => doc.name === 'foo');
      expect(fooDoc.startingLine).toEqual(4);
      expect(fooDoc.endingLine).toEqual(9);

      const barDoc = docs.find(doc => doc.name === 'bar');
      expect(barDoc.startingLine).toEqual(10);
      expect(barDoc.endingLine).toEqual(16);
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
      expect(someThingDoc.content).toEqual('the constant doc');
      expect(someThingDoc.additionalDeclarations).toEqual([
        someThingDoc.symbol.getDeclarations()[0],
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

    it('should add each exportDoc to the exportSymbolsToDocsMap', () => {
      processor.sourceFiles = [ 'returnTypes.ts' ];
      const docs: DocCollection = [];
      processor.$process(docs);

      const map = injector.get('exportSymbolsToDocsMap') as Map<Symbol, ExportDoc>;
      expect(map.size).toEqual(2);
      map.forEach((doc, symbol) => {
        expect(doc.symbol).toBe(symbol);
      });
    });
  });

  describe('ignoreExportsMatching', () => {
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

    it('should only ignore `__esModule` exports by default', () => {
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

  describe('interfaces', () => {

    it('should mark optional properties', () => {
      processor.sourceFiles = [ 'interfaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc = docs[0];
      const exportedInterface = moduleDoc.exports[0];
      const member = exportedInterface.members[0];
      expect(member.name).toEqual('optionalProperty');
      expect(member.isOptional).toEqual(true);
    });

    it('should handle "call" type interfaces', () => {
      processor.sourceFiles = [ 'interfaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);

      const moduleDoc: ModuleDoc = docs[0];
      const exportedInterface = moduleDoc.exports[0] as InterfaceExportDoc;

      const callMember = exportedInterface.members.find(member => member.isCallMember)! as MethodMemberDoc;

      expect(callMember).toBeDefined();
      expect(callMember.parameters).toEqual(['param: T']);
      expect(callMember.type).toEqual('U');
      expect(callMember.typeParameters).toEqual('<T, U extends Findable<T>>');

      const newMember = exportedInterface.members.find(member => member.isNewMember)! as MethodMemberDoc;
      expect(newMember).toBeDefined();
      expect(newMember.parameters).toEqual(['param: number']);
      expect(newMember.type).toEqual('MyInterface');
    });
  });

  describe('export aliases', () => {

    function getProcessedDocs() {
      const docs: DocCollection = [];
      processor.sourceFiles = ['exportAliases.ts'];
      processor.$process(docs);
      const [originalExport, aliasedExport] = docs.filter(doc => doc.docType === 'class') as ClassExportDoc[];
      return {originalExport, aliasedExport};
    }

    it('should properly name the aliased export', () => {
      const {originalExport, aliasedExport} = getProcessedDocs();

      expect(originalExport.name).toEqual('OriginalExport');
      expect(originalExport.symbol.name).toEqual('OriginalExport');

      expect(aliasedExport.name).toEqual('AliasedExport');
      expect(aliasedExport.symbol.name).toEqual('OriginalExport');
    });

    it('should have the proper aliases resolved', () => {
      const {originalExport, aliasedExport} = getProcessedDocs();

      expect(originalExport.aliases).toEqual(['OriginalExport', 'exportAliases/OriginalExport']);
      expect(aliasedExport.aliases).toEqual(['AliasedExport', 'exportAliases/AliasedExport']);
    });

    it('should expose the alias symbol', () => {
      const {originalExport, aliasedExport} = getProcessedDocs();

      expect(originalExport.aliasSymbol).toBeUndefined();
      expect(aliasedExport.aliasSymbol).toBeDefined();
    });

    it('should expose the original symbols members', () => {
      const {originalExport, aliasedExport} = getProcessedDocs();

      expect(originalExport.members.map(memberDoc => memberDoc.id)).toEqual(['exportAliases/OriginalExport.sayHello()']);
      expect(aliasedExport.members.map(memberDoc => memberDoc.id)).toEqual(['exportAliases/AliasedExport.sayHello()']);
    });
  });

  describe('type aliases', () => {
    it('should find the correct type when there are multiple declarations', () => {
      processor.sourceFiles = [ 'type-aliases.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const typeAliasDoc = docs[2];
      expect(typeAliasDoc.docType).toEqual('type-alias');
      expect(typeAliasDoc.typeDefinition).toEqual('X<any>');
    });

    it('should include type parameters', () => {
      processor.sourceFiles = [ 'type-aliases.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const typeAliasDoc = docs.find(doc => doc.name === 'Parameterized');
      expect(typeAliasDoc.docType).toEqual('type-alias');
      expect(typeAliasDoc.typeParameters).toEqual('<T, R>');
    });
  });

  describe('exported functions', () => {
    it('should include type parameters', () => {
      processor.sourceFiles = [ 'functions.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc = docs.find(doc => doc.name === 'foo');
      expect(functionDoc.docType).toEqual('function');
      expect(functionDoc.typeParameters).toEqual('<T, R>');
    });
  });

  describe('members', () => {
    describe('overloaded members', () => {
      it('should create a member doc for the "real" member, which includes an overloads property', () => {
        processor.sourceFiles = [ 'overloadedMembers.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);

        const foo: MethodMemberDoc = docs.find(doc => doc.name === 'foo');
        expect(foo.parameters).toEqual(['num1: number | string', 'num2?: number']);
        const overloads = foo.overloads;
        expect(overloads.map(overload => overload.parameters)).toEqual([
          ['str: string'],
          ['num1: number', 'num2: number'],
        ]);
      });

      it('should use the first declaration as the member doc if no overload has a body', () => {
        processor.sourceFiles = [ 'overloadedMembers.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);

        const bar: MethodMemberDoc = docs.find(doc => doc.name === 'bar');
        expect(bar.overloads.length).toEqual(1);

        expect(bar.parameters).toEqual(['str: string']);
        expect(bar.overloads[0].parameters).toEqual([]);
      });
    });

    describe('overloaded constructors', () => {
      it('should create a member doc for the "real" constructor, which includes an overloads property', () => {
        processor.sourceFiles = [ 'overloadedMembers.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);

        const foo: MethodMemberDoc = docs.find(doc => doc.name === 'constructor');
        expect(foo.parameters).toEqual(['x: string', 'y: number | string', 'z?: number']);
        const overloads = foo.overloads;
        expect(overloads.map(overload => overload.parameters)).toEqual([
          ['x: string', 'y: number'],
          ['x: string', 'y: string', 'z: number'],
        ]);
      });
    });

    describe('ordering of members', () => {
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

    describe('return types', () => {
      it('should not throw if "declaration.initializer.expression.text" is undefined', () => {
        processor.sourceFiles = ['returnTypes.ts'];
        const docs: DocCollection = [];
        expect(() => { processor.$process(docs); }).not.toThrow();
      });

      it('should return the text of the type if initialized', () => {
        processor.sourceFiles = ['returnTypes.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);

        const propDocs = docs.filter(doc => doc.name === 'someProp');
        expect(propDocs[0].type).toEqual([
          '{',
          '    foo: \'bar\'',
          '}',
        ].join('\n'));
        expect(propDocs[1].type).toEqual([
          'Object.assign(this.someProp, {',
          '    bar: \'baz\'',
          '})',
        ].join('\n'));
      });
    });

    describe('member modifiers', () => {
      it('should set the readOnly flag on readonly members', () => {
        processor.sourceFiles = ['memberModifiers.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);
        const simpleProp = docs.filter(doc => doc.name === 'foo')[0];
        expect(simpleProp.isReadonly).toBeFalsy();
        const readonlyProp = docs.filter(doc => doc.name === 'bar')[0];
        expect(readonlyProp.isReadonly).toBeTruthy();
      });
    });

    describe('getters and setters', () => {
      let docs: DocCollection;
      let foo1: PropertyMemberDoc;
      let foo1Getter: AccessorInfoDoc;
      let foo1Setter: AccessorInfoDoc;
      let foo2: PropertyMemberDoc;
      let foo2Getter: AccessorInfoDoc;
      let foo2Setter: AccessorInfoDoc;
      let bar: PropertyMemberDoc;
      let barGetter: AccessorInfoDoc;
      let barSetter: AccessorInfoDoc;
      let qux: PropertyMemberDoc;
      let quxGetter: AccessorInfoDoc;
      let quxSetter: AccessorInfoDoc;
      let noType: PropertyMemberDoc;
      let noTypeGetter: AccessorInfoDoc;
      let noTypeSetter: AccessorInfoDoc;
      let decoratorProp: PropertyMemberDoc;
      let decoratorPropGetter: AccessorInfoDoc;
      let decoratorPropSetter: AccessorInfoDoc;

      beforeEach(() => {
        processor.sourceFiles = ['gettersAndSetters.ts'];
        docs = [];
        processor.$process(docs);

        foo1 = docs.find(doc => doc.name === 'foo1');
        foo2 = docs.find(doc => doc.name === 'foo2');
        bar = docs.find(doc => doc.name === 'bar');
        qux = docs.find(doc => doc.name === 'qux');
        noType = docs.find(doc => doc.name === 'noType');
        decoratorProp = docs.find(doc => doc.name === 'decoratorProp');

        foo1Getter = docs.find(doc => doc.name === 'foo1:get');
        foo1Setter = docs.find(doc => doc.name === 'foo1:set');

        foo2Getter = docs.find(doc => doc.name === 'foo2:get');
        foo2Setter = docs.find(doc => doc.name === 'foo2:set');

        barGetter = docs.find(doc => doc.name === 'bar:get');
        barSetter = docs.find(doc => doc.name === 'bar:set');

        quxGetter = docs.find(doc => doc.name === 'qux:get');
        quxSetter = docs.find(doc => doc.name === 'qux:set');

        noTypeGetter = docs.find(doc => doc.name === 'noType:get');
        noTypeSetter = docs.find(doc => doc.name === 'noType:set');

        decoratorPropGetter = docs.find(doc => doc.name === 'decoratorProp:get');
        decoratorPropSetter = docs.find(doc => doc.name === 'decoratorProp:set');
      });

      it('should create a property member doc for property that has accessors', () => {
        expect(foo1).toBeDefined();
        expect(foo1.docType).toBe('member');
        expect(foo2).toBeDefined();
        expect(foo2.docType).toBe('member');
        expect(bar).toBeDefined();
        expect(bar.docType).toBe('member');
        expect(qux).toBeDefined();
        expect(qux.docType).toBe('member');
      });

      it('should create a doc for each accessor of a property', () => {
        expect(foo1Getter).toBeDefined();
        expect(foo1Getter.docType).toBe('get-accessor-info');
        expect(foo1Getter.content).toEqual('');
        expect(foo1Setter).toBeDefined();
        expect(foo1Setter.docType).toBe('set-accessor-info');
        expect(foo1Setter.content).toEqual('foo1 setter');
        expect(foo2Getter).toBeDefined();
        expect(foo2Getter.docType).toBe('get-accessor-info');
        expect(foo2Getter.content).toEqual('foo2 getter');
        expect(foo2Setter).toBeDefined();
        expect(foo2Setter.docType).toBe('set-accessor-info');
        expect(foo2Setter.content).toEqual('');
        expect(barGetter).toBeDefined();
        expect(barGetter.docType).toBe('get-accessor-info');
        expect(barGetter.content).toEqual('bar getter');
        expect(barSetter).toBeUndefined();
        expect(quxGetter).toBeUndefined();
        expect(quxSetter).toBeDefined();
        expect(quxSetter.docType).toBe('set-accessor-info');
        expect(quxSetter.content).toEqual('qux setter');
      });

      it('should compute the type of the property from its accessors', () => {
        expect(foo1.type).toEqual('string');
        expect(foo2.type).toEqual('string');
        expect(bar.type).toEqual('number');
        expect(qux.type).toEqual('object');
        expect(noType.type).toEqual('string');
      });

      it('should compute the content of the property from its accessors', () => {
        expect(foo1.content).toEqual('foo1 setter');
        expect(foo2.content).toEqual('foo2 getter');
        expect(bar.content).toEqual('bar getter');
        expect(qux.content).toEqual('qux setter');
        expect(noType.content).toEqual('This has no explicit getter return type');
      });

      it('should attach each accessor doc to its property doc', () => {
        expect(foo1.getAccessor).toBe(foo1Getter);
        expect(foo1.setAccessor).toBe(foo1Setter);
        expect(foo2.getAccessor).toBe(foo2Getter);
        expect(foo2.setAccessor).toBe(foo2Setter);
        expect(bar.getAccessor).toBe(barGetter);
        expect(bar.setAccessor).toBe(null);
        expect(qux.getAccessor).toBe(null);
        expect(qux.setAccessor).toBe(quxSetter);
      });

      describe('if getter is missing information', () => {
        it('should add decorators of the setter to the property doc', () => {
          expect(decoratorProp.decorators![0].name).toBe('SomeDecorator');
        });

        it('should add description of the setter to the property doc', () => {
          expect(decoratorProp.content).toBe('Description of myProperty.');
        });

        it('should add type of the setter to the property doc', () => {
          expect(decoratorProp.type).toBe('string');
        });
      });
    });

    describe('method parameters', () => {
      it('should process method parameters', () => {
        processor.sourceFiles = ['methodParameters.ts'];
        const docs: DocCollection = [];
        processor.$process(docs);
        const param1: ParameterDoc = docs.find(doc => doc.name === 'param1' && doc.container.name === 'method1');
        expect(param1.docType).toEqual('parameter');
        expect(param1.id).toEqual('methodParameters/TestClass.method1()~param1');
        expect(param1.content).toEqual('description of param1');
        expect(param1.type).toEqual('number');
        expect(param1.isOptional).toBe(false);
        expect(param1.defaultValue).toBeUndefined();

        const param2: ParameterDoc = docs.find(doc => doc.name === 'param2' && doc.container.name === 'method1');
        expect(param2.docType).toEqual('parameter');
        expect(param2.id).toEqual('methodParameters/TestClass.method1()~param2');
        expect(param2.content).toEqual('description of param2');
        expect(param2.type).toEqual('string');
        expect(param2.isOptional).toBe(true);
        expect(param2.defaultValue).toBeUndefined();

        const param3: ParameterDoc = docs.find(doc => doc.name === 'param3' && doc.container.name === 'method1');
        expect(param3.docType).toEqual('parameter');
        expect(param3.id).toEqual('methodParameters/TestClass.method1()~param3');
        expect(param3.content).toEqual('description of param3');
        expect(param3.type).toEqual('object');
        expect(param3.isOptional).toBe(false);
        expect(param3.defaultValue).toBe('{}');

        const method1: MethodMemberDoc = docs.find(doc => doc.name === 'method1')!;
        expect(method1.parameterDocs).toEqual([param1, param2, param3]);
      });
    });
  });

  describe('namespaces', () => {
    it('should not strip namespaces in return types', () => {
      processor.sourceFiles = ['stripNamespaces.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc = docs.find(doc => doc.docType === 'function');
      expect(functionDoc.type).toEqual('angular.IDirective');
    });

    it('should cope with spread operator', () => {
      processor.sourceFiles = ['spreadParams.ts'];
      const docs: DocCollection = [];
      processor.$process(docs);
      const functionDoc: FunctionExportDoc = docs.find(doc => doc.docType === 'function');
      expect(functionDoc.parameters).toEqual(['...args: Array<any>']);
      expect(functionDoc.type).toEqual('void');

      const interfaceDoc = docs.find(doc => doc.docType === 'interface');
      expect(interfaceDoc.members.length).toEqual(2);
      const methodDoc: MethodMemberDoc = interfaceDoc.members[0];
      expect(methodDoc.parameters).toEqual(['...args: Array<any>']);
      expect(methodDoc.type).toEqual('void');

      const propertyDoc = interfaceDoc.members[1];
      expect(propertyDoc.type).toEqual('(...args: Array<any>) => void');    });
  });

  describe('source file globbing patterns', () => {
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
});

function getNames(collection: Array<{name: string}>) {
  return collection.map(item => item.name);
}
