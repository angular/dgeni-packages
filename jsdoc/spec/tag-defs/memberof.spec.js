var tagDefFactory = require('../../tag-defs/memberof');
var createDocMessageFactory = require('../../../base/services/createDocMessage');

describe("memberof tag-def", function() {
  var tagDef;

  beforeEach(function() {
    tagDef = tagDefFactory(createDocMessageFactory());
  });

  describe('transforms', function() {
    it("should throw an exception if the docType is not 'event', 'method' or 'property'", function() {
      expect(function() {
        tagDef.transforms({ docType: 'unknown'});
      }).toThrowError();

      expect(function() {
        tagDef.transforms({ docType: 'event'});
      }).not.toThrowError();

      expect(function() {
        tagDef.transforms({ docType: 'method'});
      }).not.toThrowError();

      expect(function() {
        tagDef.transforms({ docType: 'property'});
      }).not.toThrowError();
    });
  });


  describe("defaultFn", function() {
    it("should throw an exception if the docType is 'event', 'method' or 'property'", function() {
      expect(function() {
        tagDef.defaultFn({ docType: 'unknown'});
      }).not.toThrowError();

      expect(function() {
        tagDef.defaultFn({ docType: 'event'});
      }).toThrowError();

      expect(function() {
        tagDef.defaultFn({ docType: 'method'});
      }).toThrowError();

      expect(function() {
        tagDef.defaultFn({ docType: 'property'});
      }).toThrowError();
    });
  });
});