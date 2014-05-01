var parseTagsProcessor = require('../../processors/parse-tags');

describe("parse-tags processor", function() {
  it("should be called 'parse-tags'", function() {
    expect(parseTagsProcessor.name).toEqual('parse-tags');
  });
  it("should be run in the correct place", function() {
    expect(parseTagsProcessor.runAfter).toEqual([ 'parsing-tags' ]);
    expect(parseTagsProcessor.runBefore).toEqual([ 'tags-parsed' ]);
  });

  it("should call tagParser for each doc and assign the result to `doc.tags`", function() {
    var testTag = {};
    var tagParser = jasmine.createSpy('tagParser').and.returnValue([testTag]);
    var doc = {};
    parseTagsProcessor.process([doc], tagParser);
    expect(tagParser).toHaveBeenCalled();
    expect(doc.tags).toEqual([testTag]);
  });
});