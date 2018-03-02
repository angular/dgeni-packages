import { createSourceFile, ScriptTarget } from 'typescript';
import { DocCollection } from 'dgeni';
import { ClassExportDoc } from '../api-doc-types/ClassExportDoc';
import { HeritageInfo } from '../api-doc-types/ClassLikeExportDoc';
import { convertPrivateClassesToInterfaces } from './convertPrivateClassesToInterfaces';
import { FileInfo } from './TsParser/FileInfo';

describe('convertPrivateClassesToInterfaces', () => {
  const basePath = 'a/b/c';
  const moduleDoc = { id: 'someModule', basePath } as any;
  const mockDeclaration: any = { getSourceFile: () => createSourceFile('x/y/z', 'blah blah', ScriptTarget.ES5), pos: 0, end: 0 };
  const classSymbol: any = {
    getDeclarations: () => [mockDeclaration],
    name: 'privateClass',
    valueDeclaration: mockDeclaration,
  };

  let classDoc: ClassExportDoc;
  let docs: DocCollection;

  beforeEach(() => {
    spyOn(FileInfo.prototype, 'getRealFilePath').and.callFake((filePath: string) => filePath);

    classDoc = new ClassExportDoc(moduleDoc, classSymbol);
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
    const heritage = new HeritageInfo({} as any, '');
    classDoc.implementsClauses = [heritage];
    convertPrivateClassesToInterfaces(docs, false);
    expect(docs[0].extendsClauses).toEqual([heritage]);
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
