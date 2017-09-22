import { Dgeni, DocCollection } from 'dgeni';
import { Injector } from 'dgeni/lib/Injector';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { LinkInheritedDocs } from './linkInheritedDocs';
import { ReadTypeScriptModules } from './readTypeScriptModules';
const mockPackage = require('../mocks/mockPackage');
const path = require('canonical-path');

describe('linkInheritedDocs', () => {

  let dgeni: Dgeni;
  let injector: Injector;
  let tsProcessor: ReadTypeScriptModules;
  let linkProcessor: LinkInheritedDocs;

  beforeEach(() => {
    dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();

    tsProcessor = injector.get('readTypeScriptModules');
    linkProcessor = injector.get('linkInheritedDocs');
    tsProcessor.basePath = path.resolve(__dirname, '../mocks/linkInheritedDocs');
    tsProcessor.sourceFiles = ['index.ts', 'deps.ts'];
  });

  it('should properly link the inherited docs', () => {
    const docsArray: DocCollection = [];

    tsProcessor.$process(docsArray);
    linkProcessor.$process(docsArray);

    const childDoc: ClassLikeExportDoc = docsArray.find(doc => doc.name === 'Child');
    const firstParentDoc: ClassLikeExportDoc = docsArray.find(doc => doc.name === 'FirstParent');
    const lastParentDoc: ClassLikeExportDoc = docsArray.find(doc => doc.name === 'LastParent');

    expect(childDoc.extendsClauses.map(clause => clause.doc)).toEqual([firstParentDoc]);
    expect(firstParentDoc.extendsClauses.map(clause => clause.doc)).toEqual([lastParentDoc]);
    expect(lastParentDoc.extendsClauses.map(clause => clause.doc)).toEqual([]);

    expect(lastParentDoc.descendants).toEqual([firstParentDoc]);
    expect(firstParentDoc.descendants).toEqual([childDoc]);
    expect(childDoc.descendants).toEqual([]);
  });

  it('should properly resolve members in inherited docs', () => {
    const docsArray: DocCollection = [];

    tsProcessor.$process(docsArray);
    linkProcessor.$process(docsArray);

    const childDoc: ClassLikeExportDoc = docsArray.find(doc => doc.name === 'Child');
    const memberNames = getInheritedMembers(childDoc).map(member => member.name);

    expect(memberNames.length).toBe(3);
    expect(memberNames).toContain('childProp');
    expect(memberNames).toContain('firstParentProp');
    expect(memberNames).toContain('lastParentProp');
  });

  /** Returns a list of all inherited members of a doc. */
  function getInheritedMembers(doc: ClassLikeExportDoc) {
    let members = doc.members || [];

    doc.extendsClauses.forEach(clause => {
      members = members.concat(getInheritedMembers(clause.doc!));
    });

    return members;
  }
});
