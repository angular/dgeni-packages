var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

describe('checkAccessTags doc processor', function() {

  var jsParser, processor;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    jsParser = injector.get('jsParser');
    processor = injector.get('checkAccessTagsProcessor');
  });

  it("should default the defined access types to private, protected and public", function() {
    expect(processor.accessTypes).toEqual(['private', 'protected', 'public']);
  });

  it("should convert defined access tags (private, protected, public) to boolean properties on the doc", function() {
    processor.accessTypes.forEach(function(accessType) {
      var doc = { access: accessType };
      processor.$process([doc]);
      expect(doc[accessType]).toBe(true);
    });
  });

  it("should allow new access types to be configured", function() {
    processor.accessTypes.push('custom');
    var doc = { access: 'custom' };
    processor.$process([doc]);
    expect(doc.custom).toBe(true);
  });

  it("should throw an error if the doc uses an access type that is not defined", function() {
    var doc = { access: 'custom' };
    expect(function() {
      processor.$process([doc]);
    }).toThrowError('"custom" is not an allowed access type for the "@access" tag. Try adding it to the checkAccessTagsProcessor.accessTypes array - doc');
  });

  it("should throw an error if the doc already contains an associated explicit standard tag", function() {
    processor.accessTypes.forEach(function(accessType) {
      var doc = { access: accessType };
      doc[accessType] = 'some description';
      expect(function() {
        processor.$process([doc]);
      }).toThrowError('Only one access type tag is allowed per document. Tags found were:\n* @' + accessType + '\n* @access ' + accessType + '\n - doc');
    });
  });

  it("should throw an error if the doc contains more than one access declaration (explicit or via @access)", function() {
    var doc = { access: 'private', public: true };
    expect(function() {
      processor.$process([doc]);
    }).toThrowError('Only one access type tag is allowed per document. Tags found were:\n* @public\n* @access private\n - doc');

    doc = { protected: 'some description', public: true };
    expect(function() {
      processor.$process([doc]);
    }).toThrowError('Only one access type tag is allowed per document. Tags found were:\n* @protected\n* @public\n - doc');
  });
});
