import { DocCollection } from 'dgeni';
import { ClassExportDoc } from '../api-doc-types/ClassExportDoc';
import { convertPrivateClassesToInterfaces } from './convertPrivateClassesToInterfaces';

describe('convertPrivateClassesToInterfaces', () => {
  const basePath = 'a/b/c';
  const moduleDoc = { id: 'someModule' } as any;
  const mockDeclaration: any = { getSourceFile: () => ({ fileName: 'x/y/z', text: 'blah blah' }) };
  const classSymbol: any = {
    getDeclarations: () => [mockDeclaration],
    name: 'privateClass',
    valueDeclaration: mockDeclaration,
  };

  let classDoc: ClassExportDoc;
  let docs: DocCollection;

  beforeEach(() => {
    classDoc = new ClassExportDoc(moduleDoc, classSymbol, basePath, true);
    classDoc.constructorDoc = { internal: true } as any;
    docs = [classDoc];
  });

  it('should convert private class docs to interface docs', () => {
    convertPrivateClassesToInterfaces(docs, false);
    expect(docs[0].docType).toEqual('interface');
  });

  it('should not touch non-private class docs', () => {
    classDoc.constructorDoc = {} as any;
    convertPrivateClassesToInterfaces(docs, false);
    expect(docs[0].docType).toEqual('class');
  });

  it('should convert the heritage since interfaces use `extends` not `implements`', () => {
    classDoc.implementsClauses = ['parentInterface'];
    convertPrivateClassesToInterfaces(docs, false);
    expect(docs[0].extendsClauses).toEqual(['parentInterface']);
  });

  it('should add new injectable reference types, if specified, to the passed in collection', () => {
    convertPrivateClassesToInterfaces(docs, true);
    expect(docs[1]).toEqual(jasmine.objectContaining({
      docType: 'const',
      id: 'someModule/privateClass',
      name: 'privateClass',
      type: 'InjectableReference',
    }));
  });
});
