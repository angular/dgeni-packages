var Dgeni = require('dgeni');
var mockPackage = require('../../mocks/mockPackage');

var transformFactory = require('./extract-access');

describe("extract-access transform", function() {
  var transform;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    transform = injector.get('extractAccessTransform');
  });

  describe('(@access tag)', function () {
    var doc, tag;
    beforeEach(function() {
      doc = {};
      tag = { tagDef: { name: "access" } };

      transform.allowedTags = new Map();
      transform.allowedTags.set('private');
      transform.allowedTags.set('public');
    });

    it("should extract the access restrictions for property", function() {
      doc.docType = 'property';

      var value = transform(doc, tag, 'private');
      expect(doc.access).toEqual('private');
      expect(value).toBeUndefined();
    });

    it("should extract the access restrictions for method", function() {
      doc.docType = 'method';

      var value = transform(doc, tag, 'public');
      expect(doc.access).toEqual('public');
      expect(value).toBeUndefined();
    });

    it("should throw an error for unknown doc types", function() {
      doc.docType = 'other';
      expect(function () {
        transform(doc, tag, 'other');
      }).toThrowError('Illegal use of "@access" tag.\n' +
                      'You can only use this tag on the following docTypes: [ property, method ].\n' +
                      'Register this docType with extractAccessTransform.addDocType("other") prior to use - doc (other) ');
    });

    it("should throw an error for unknown value", function() {
      doc.docType = 'method';

      value = 'root';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Illegal value for `doc.access` property of "root".\n' +
                      'This property can only contain the following values: [ "private", "public" ] - doc (method) ');
    });

    it("should throw an error for more than one access tag", function() {
      doc.docType = 'method';
      doc.access = 'private';

      value = 'private';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Illegal use of "@access" tag.\n' +
                      '`doc.access` property is already defined as "private".\n' +
                      'Only one of the following tags allowed per doc: [ "@access", "@private", "@public" ] - doc (method) ');
    });

    it("should throw an error if no value defined", function() {
      doc.docType = 'method';

      value = '';

      expect(function () {
        transform(doc, tag, value);
      }).toThrowError('Illegal value for `doc.access` property of "".\n' +
                      'This property can only contain the following values: [ "private", "public" ] - doc (method) ');
    });
  });

  describe('(other tags)', function () {


    it("should throw an error if the tag is not registered with the extractAccessTransform", function () {
      doc = { docType: 'property' };
      tag = { tagDef: { name: 'other' } };

      expect(function () {
        transform(doc, tag, '');
      }).toThrowError('Register tag @other with extractAccessTransform.allowedTags.set("other") prior to use - doc (property) ');
    });

    it('should return the value passed to the allowedTags map', function() {
      transform.allowedTags.set('a', 'blah');
      transform.allowedTags.set('b');

      doc = { docType: 'property' };
      tag = { tagDef: { name: 'a' } };

      var value = transform(doc, tag, 'some value');
      expect(value).toEqual('blah');
      expect(doc.access).toEqual('a');

      doc = { docType: 'property' };
      tag = { tagDef: { name: 'b' } };
      var value = transform(doc, tag, 'some value');
      expect(value).toBeUndefined();
      expect(doc.access).toEqual('b');
    });
  });
});