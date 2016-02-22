var Dgeni = require('dgeni');
var mockPackage = require('../../mocks/mockPackage');

var transformFactory = require('./extract-access');

describe("extract-access transform", function() {
  var doc, tag, value, transform;
  var createDocMessage, log;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    createDocMessage = injector.get('createDocMessage');
    log = jasmine.createSpyObj('log', ['error', 'warn', 'info', 'debug', 'silly']);
  });

  describe('for valid tag', function () {
    beforeEach(function() {
      doc = {};

      tag = {
        tagDef: {
          name: "access"
        }
      };

      transform = transformFactory(createDocMessage, log);

      transform.addTag('access');
      transform.addTag('private');
      transform.addValue('private');
      transform.addValue('protected');
      transform.addValue('public');
    });

    it("should extract the access restrictions for property", function() {
      doc.docType = 'property';

      value = 'private';
      value = transform(doc, tag, value);

      expect(value).toEqual('private');
    });

    it("should extract the access restrictions for method", function() {
      doc.docType = 'method';

      value = 'public';
      value = transform(doc, tag, value);

      expect(value).toEqual('public');
    });

    it("should throw an error for unknown doc types", function() {
      doc.docType = 'other';

      value = 'protected';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('"@access" tag found on @other document while defined for @propery and @method only - doc (other) ');
    });

    it("should throw an error for unknown value", function() {
      doc.docType = 'method';

      value = 'root';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('@access sets value "root". Only one of [ "private", "protected", "public" ] allowed - doc (method) ');
    });

    it("should throw an error for more than one access tag", function() {
      doc.docType = 'method';
      doc.access = 'private';

      value = 'private';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Access value "private" is already defined. Only one of [ "@access", "@private" ] per comment allowed - doc (method) ');
    });

    it("should throw an error if no value defined and tag name may not be the value", function() {
      doc.docType = 'method';

      value = '';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('@access sets value "access". Only one of [ "private", "protected", "public" ] allowed - doc (method) ');
    });
  });

  describe('for valid document', function () {
    beforeEach(function() {
      doc = {
        docType: 'property'
      };

      tag = {
        tagDef: {
        }
      };

      transform = transformFactory(createDocMessage, log);

      transform.addTag('access');
      transform.addValue('private');
      transform.addValue('public');
    });

    it("should throw an error for wrong tag definition", function () {
      tag.tagDef.name = 'other';

      value = 'private';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Tag @other does not fill up doc.access property - doc (property) ');
    });

    it("should throw an error for wrong tag definition", function () {
      tag.tagDef.name = 'other';
      tag.tagDef.docProperty = 'access';

      value = 'other';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Register tag @other with accessTagTransform.addTag("other") prior to use - doc (property) ');
    });
  })

  describe("tag settings", function () {
    beforeEach(function () {
      transform = transformFactory(createDocMessage, log);
    })

    it("should return accessTagTransform after tag registration", function () {
      expect(transform.addTag("access")).toEqual(transform);
      expect(transform.addTag("public")).toEqual(transform);
    });

    it("should log non-fatal error for duplicate tag registration", function () {
      transform.addTag("access");
      transform.addTag("access");
      expect(log.error.calls.allArgs()).toEqual([ [ 'Tag "access" is already defined' ] ]);
    });

    it("should allow multiple value registration", function () {
      expect(transform.addValue("tag")).toEqual(transform);
      expect(transform.addValue("other")).toEqual(transform);
      expect(transform.addValue("other")).toEqual(transform);
    });

    it("should ignore empty value", function () {
      expect(transform.addValue()).toEqual(transform);
      expect(transform.addValue("")).toEqual(transform);
    });
  });
});