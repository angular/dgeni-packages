var tagDefFactory = require('./license');

describe("license tag-def", function() {
  var tagDef;

  beforeEach(function() {
    tagDef = tagDefFactory();
  });

  it('should pull in the license detail if it matches the SPDX License List', function() {
    var doc = {};
    var result = tagDef.transforms(doc, 'license', 'Apache-2.0');
    expect(result).toEqual('Apache-2.0');
    expect(doc.licenseDescription).toEqual(jasmine.objectContaining({
      "name": "Apache License 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0\nhttp://www.opensource.org/licenses/Apache-2.0",
      "osiApproved": true
    }));

    expect(doc.licenseDescription.license).toContain('Apache License\nVersion 2.0, January 2004');
  });
});