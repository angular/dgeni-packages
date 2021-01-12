const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("collectKnownIssuesProcessor", () => {
  let processor, moduleMap;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('collectKnownIssuesProcessor');
  });

  it("should add API docs that have known issues to their module doc", () => {
    const module1 = {};
    const module2 = {};
    const docs = [
      { id: 'doc-with-issues-1', moduleDoc: module1, knownIssues: [ 'issue 1', 'issue 2' ] },
      { id: 'doc-with-empty-issues', moduleDoc: module1, knownIssues: [] },
      { id: 'doc-with-no-issues', moduleDoc: module2 },
      { id: 'doc-with-issues-1', moduleDoc: module2, knownIssues: [ 'issue 3', 'issue 4' ] }
    ];
    processor.$process(docs);
    expect(module1).toEqual({ knownIssueDocs: [docs[0]] });
    expect(module2).toEqual({ knownIssueDocs: [docs[3]] });
  });
});