const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');
const path = require('canonical-path');

describe('linkInheritedDocs', function() {

  let dgeni, injector, tsProcessor, linkProcessor = null;

  beforeEach(function () {
    dgeni = new Dgeni([mockPackage()]);
    injector = dgeni.configureInjector();

    tsProcessor = injector.get('readTypeScriptModules');
    linkProcessor = injector.get('linkInheritedDocs');

    // Since the `readTypeScriptModules` mock folder includes the a good amount files, the
    // spec for linking the inherited docs will just use those.
    tsProcessor.basePath = path.resolve(__dirname, '../mocks/readTypeScriptModules');
  });

  it('should properly link the inherited docs', () => {
    const docsArray = [];

    tsProcessor.sourceFiles = ['inheritedMembers.ts'];

    tsProcessor.$process(docsArray);
    linkProcessor.$process(docsArray);

    const childDoc = docsArray.find(doc => doc.name === 'Child');
    const firstParentDoc = docsArray.find(doc => doc.name === 'FirstParent');
    const lastParentDoc = docsArray.find(doc => doc.name === 'LastParent');

    expect(childDoc.inheritedDocs).toEqual([firstParentDoc]);
    expect(firstParentDoc.inheritedDocs).toEqual([lastParentDoc]);
    expect(lastParentDoc.inheritedDocs).toEqual([]);
  });

  it('should properly resolve members in inherited docs', () => {
    const docsArray = [];

    tsProcessor.sourceFiles = ['inheritedMembers.ts'];

    tsProcessor.$process(docsArray);
    linkProcessor.$process(docsArray);

    const childDoc = docsArray.find(doc => doc.name === 'Child');
    const memberNames = getInheritedMembers(childDoc).map(member => member.name);

    expect(memberNames.length).toBe(3);
    expect(memberNames).toContain('childProp');
    expect(memberNames).toContain('firstParentProp');
    expect(memberNames).toContain('lastParentProp');
  });

  /** Returns a list of all inherited members of a doc. */
  function getInheritedMembers(doc) {
    let members = doc.members || [];

    doc.inheritedDocs.forEach(inheritedDoc => {
      members = members.concat(getInheritedMembers(inheritedDoc));
    });

    return members;
  }
});
