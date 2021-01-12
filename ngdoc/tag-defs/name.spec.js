var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

var tagDefFactory = require('./name');

describe("name tag-def", () => {
  var tagDef;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    tagDef = injector.invoke(tagDefFactory);
  });

  it("should update the inputType if docType is input", () => {
    var doc = { docType: 'input' };
    var tag = {};
    var value = tagDef.transforms(doc, tag, 'input[checkbox]');
    expect(value).toEqual('input[checkbox]');
    expect(doc.inputType).toEqual('checkbox');
  });

  it("should not update the inputType if docType is not input", () => {
    var doc = { docType: 'directive' };
    var tag = {};
    var value = tagDef.transforms(doc, tag, 'input[checkbox]');
    expect(value).toEqual('input[checkbox]');
    expect(doc.inputType).toBeUndefined();
  });

  it("should throw error if the docType is 'input' and the name is not a valid format", () => {
    var doc = { docType: 'input' };
    var tag = {};
    expect(() => tagDef.transforms(doc, tag, 'invalidInputName')).toThrow();
  });

});
