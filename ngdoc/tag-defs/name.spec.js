const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

const tagDefFactory = require('./name');

describe("name tag-def", () => {
  let tagDef;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    tagDef = injector.invoke(tagDefFactory);
  });

  it("should update the inputType if docType is input", () => {
    const doc = { docType: 'input' };
    const tag = {};
    const value = tagDef.transforms(doc, tag, 'input[checkbox]');
    expect(value).toEqual('input[checkbox]');
    expect(doc.inputType).toEqual('checkbox');
  });

  it("should not update the inputType if docType is not input", () => {
    const doc = { docType: 'directive' };
    const tag = {};
    const value = tagDef.transforms(doc, tag, 'input[checkbox]');
    expect(value).toEqual('input[checkbox]');
    expect(doc.inputType).toBeUndefined();
  });

  it("should throw error if the docType is 'input' and the name is not a valid format", () => {
    const doc = { docType: 'input' };
    const tag = {};
    expect(() => tagDef.transforms(doc, tag, 'invalidInputName')).toThrow();
  });

});
