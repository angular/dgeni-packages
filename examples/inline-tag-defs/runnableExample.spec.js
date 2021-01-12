const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("runnableExampleInlineTagDef", () => {

  let exampleMap, tagDef;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();

    exampleMap = injector.get('exampleMap');
    exampleMap.set('some-example', {
      runnableExampleDoc: {
        renderedContent: 'The rendered content of the some-example example'
      }
    });
    tagDef = injector.get('runnableExampleInlineTagDef');
  });

  it("should have the correct name", () => {
    expect(tagDef.name).toEqual('runnableExample');
  });

  it("should lookup the runnableExampleDoc identified in the tag description and return its renderedContent", () => {
    expect(tagDef.handler({}, 'runnableExample', 'some-example')).toEqual('The rendered content of the some-example example');
  });
});