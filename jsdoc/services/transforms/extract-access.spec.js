const Dgeni = require('dgeni');
const mockPackage = require('../../mocks/mockPackage');

const transformFactory = require('./extract-access');

describe("extract-access transform", () => {
  let transform;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    transform = injector.get('extractAccessTransform');
  });

  describe('(@access tag)', () => {
    let doc, tag;
    beforeEach(() => {
      doc = {};
      tag = { tagDef: { name: "access" } };

      transform.allowedTags = new Map();
      transform.allowedTags.set('private');
      transform.allowedTags.set('public');
    });

    it("should extract the access restrictions for property", () => {
      doc.docType = 'property';

      const value = transform(doc, tag, 'private');
      expect(doc.access).toEqual('private');
      expect(value).toBeUndefined();
    });

    it("should extract the access restrictions for method", () => {
      doc.docType = 'method';

      const value = transform(doc, tag, 'public');
      expect(doc.access).toEqual('public');
      expect(value).toBeUndefined();
    });

    it("should throw an error for unknown doc types", () => {
      doc.docType = 'other';
      expect(() => transform(doc, tag, 'other')).toThrowError('Illegal use of "@access" tag.\n' +
                      'You can only use this tag on the following docTypes: [ property, method ].\n' +
                      'Register this docType with extractAccessTransform.addDocType("other") prior to use - doc (other) ');
    });

    it("should throw an error for unknown value", () => {
      doc.docType = 'method';

      const value = 'root';

      expect(() => transform(doc, tag, value)).toThrowError('Illegal value for `doc.access` property of "root".\n' +
                      'This property can only contain the following values: [ "private", "public" ] - doc (method) ');
    });

    it("should throw an error for more than one access tag", () => {
      doc.docType = 'method';
      doc.access = 'private';

      const value = 'private';

      expect(() => transform(doc, tag, value)).toThrowError('Illegal use of "@access" tag.\n' +
                      '`doc.access` property is already defined as "private".\n' +
                      'Only one of the following tags allowed per doc: [ "@access", "@private", "@public" ] - doc (method) ');
    });

    it("should throw an error if no value defined", () => {
      doc.docType = 'method';

      const value = '';

      expect(() => transform(doc, tag, value)).toThrowError('Illegal value for `doc.access` property of "".\n' +
                      'This property can only contain the following values: [ "private", "public" ] - doc (method) ');
    });
  });

  describe('(other tags)', () => {


    it("should throw an error if the tag is not registered with the extractAccessTransform", () => {
      const doc = { docType: 'property' };
      const tag = { tagDef: { name: 'other' } };

      expect(() => transform(doc, tag, '')).toThrowError('Register tag @other with extractAccessTransform.allowedTags.set("other") prior to use - doc (property) ');
    });

    it('should return the value passed to the allowedTags map', () => {
      transform.allowedTags.set('a', 'blah');
      transform.allowedTags.set('b');

      const doc1 = { docType: 'property' };
      const tag1 = { tagDef: { name: 'a' } };

      const value1 = transform(doc1, tag1, 'some value');
      expect(value1).toEqual('blah');
      expect(doc1.access).toEqual('a');

      const doc2 = { docType: 'property' };
      const tag2 = { tagDef: { name: 'b' } };
      const value2 = transform(doc2, tag2, 'some value');
      expect(value2).toBeUndefined();
      expect(doc2.access).toEqual('b');
    });
  });
});