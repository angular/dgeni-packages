const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');
const tagDefFactory = require('./memberof');

describe("memberof tag-def", () => {
  let tagDef;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
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