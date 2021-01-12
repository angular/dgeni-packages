var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var tagDefFactory = require('./memberof');

describe("memberof tag-def", () => {
  var tagDef;

  beforeEach(() => {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    tagDef = injector.invoke(tagDefFactory);
  });

  describe('transforms', () => {
    it("should throw an exception if the docType is not 'event', 'method' or 'property'", () => {
      expect(() => tagDef.transforms({ docType: 'unknown'})).toThrowError();
      expect(() => tagDef.transforms({ docType: 'event'})).not.toThrowError();
      expect(() => tagDef.transforms({ docType: 'method'})).not.toThrowError();
      expect(() => tagDef.transforms({ docType: 'property'})).not.toThrowError();
    });
  });


  describe("defaultFn", () => {
    it("should throw an exception if the docType is 'event', 'method' or 'property'", () => {
      expect(() => tagDef.defaultFn({ docType: 'unknown'})).not.toThrowError();
      expect(() => tagDef.defaultFn({ docType: 'event'})).toThrowError();
      expect(() => tagDef.defaultFn({ docType: 'method'})).toThrowError();
      expect(() => tagDef.defaultFn({ docType: 'property'})).toThrowError();
    });
  });
});