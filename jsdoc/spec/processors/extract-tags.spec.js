var rewire = require('rewire');
var plugin = rewire('../../processors/extract-tags');

describe("extract-tags doc processor plugin", function() {
  it("should have name 'extract-tags", function() {
    expect(plugin.name).toEqual('extract-tags');
  });

  it("should call extractTags on the document", function() {
    var doc = {};
    var extractTagsSpy = jasmine.createSpy('extractTags');
    plugin.process([doc], extractTagsSpy);
    expect(extractTagsSpy).toHaveBeenCalledWith(doc);
  });
});