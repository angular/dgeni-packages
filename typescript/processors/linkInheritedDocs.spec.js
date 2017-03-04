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
    let docsArray = [];

    tsProcessor.sourceFiles = ['inheritedMembers.ts'];

    tsProcessor.$process(docsArray);
    linkProcessor.$process(docsArray);

    let childDoc = docsArray[3];
    let members = getInheritedMembers(childDoc);

    expect(members.length).toBe(3);
    expect(members[0].name).toBe('childProp');
    expect(members[1].name).toBe('firstParentProp');
    expect(members[2].name).toBe('lastParentProp');
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
