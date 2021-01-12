const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("generateComponentGroupsProcessor", () => {
  let processor, moduleMap;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('generateComponentGroupsProcessor');
    moduleMap = injector.get('moduleMap');
  });

  it("should create a new doc for each group of components (by docType) in each module", () => {
    const docs = [];
    moduleMap.set('mod1', {
      id: 'mod1',
      name: 'mod1',
      components: [
        { docType: 'a', id: 'a1' },
        { docType: 'a', id: 'a2' },
        { docType: 'a', id: 'a3' },
        { docType: 'a', id: 'a4' },
        { docType: 'b', id: 'b1' },
        { docType: 'b', id: 'b2' },
        { docType: 'b', id: 'a3' }
      ]
    });
    processor.$process(docs);

    expect(docs.length).toEqual(2);

    expect(docs[0].name).toEqual('a components in mod1');
    expect(docs[0].moduleName).toEqual('mod1');
    expect(docs[0].moduleDoc).toEqual(jasmine.objectContaining({ id: 'mod1' }));

    expect(docs[1].name).toEqual('b components in mod1');
    expect(docs[1].moduleName).toEqual('mod1');
    expect(docs[1].moduleDoc).toEqual(jasmine.objectContaining({ id: 'mod1' }));
  });

  it("should not generate componentGroup docs for the 'overview' docType", () => {

    moduleMap.set('mod1', {
      id: 'mod1',
      name: 'mod1',
      components: [
        { docType: 'overview', id: 'a1' },
        { docType: 'a', id: 'a1' }
      ]
    });
    const docs = [];
    processor.$process(docs);
    expect(docs.length).toEqual(1);

    expect(docs[0].name).toEqual('a components in mod1');

  });

  it("should attach the componentGroup to its module", () => {

    moduleMap.set('mod1', {
      id: 'mod1',
      name: 'mod1',
      components: [
        { docType: 'a', id: 'a1' },
        { docType: 'a', id: 'a2' },
        { docType: 'a', id: 'a3' },
        { docType: 'a', id: 'a4' },
        { docType: 'b', id: 'b1' },
        { docType: 'b', id: 'b2' },
        { docType: 'b', id: 'a3' }
      ]
    });
    const docs = [];
    processor.$process(docs);
    const componentGroups = moduleMap.get('mod1').componentGroups;
    expect(componentGroups.length).toEqual(2);
    expect(componentGroups[0].name).toEqual('a components in mod1');
  });
});