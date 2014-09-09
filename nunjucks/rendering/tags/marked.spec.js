var rewire = require('rewire');
var extensionFactory = rewire('./marked');

describe("marked custom tag extension", function() {
  var extension, markedMock, trimSpy;

  beforeEach(function() {
    markedMock = jasmine.createSpy('marked').and.callFake(function(str) {return str;});
    extensionFactory.__set__('marked', markedMock);
    trimSpy = jasmine.createSpyObj('trimSpy', ['calcIndent', 'trimIndent', 'reindent']);
    extension = extensionFactory(trimSpy);
  });

  it("should specify the tags to match", function() {
    expect(extension.tags).toEqual(['marked']);
  });

  describe("process", function() {

    it("should call the mock marked function when processing", function() {
      trimSpy.trimIndent.and.callFake(function(value) { return value; });
      extension.process(null, function() { return 'some content'; });
      expect(markedMock).toHaveBeenCalledWith('some content');
    });

    it("should trim indentation from content", function() {
      extension.process(null, function() { return 'some content'; });
      expect(trimSpy.calcIndent).toHaveBeenCalled();
      expect(trimSpy.trimIndent).toHaveBeenCalled();
      expect(trimSpy.reindent).toHaveBeenCalled();
    });
  });

  describe("parse", function() {
    it("should interact correctly with the parser", function() {
      var log = [];
      var parserMock = {
        advanceAfterBlockEnd: function() { log.push('advanceAfterBlockEnd'); },
        parseUntilBlocks: function() { log.push('parseUntilBlocks'); return 'some content'; }
      };
      var nodesMock = {
        CallExtension: function() { log.push('CallExtension'); this.args = arguments; }
      };

      var tag = extension.parse(parserMock, nodesMock);

      expect(log).toEqual([
        'advanceAfterBlockEnd',
        'parseUntilBlocks',
        'CallExtension',
        'advanceAfterBlockEnd'
      ]);

      expect(tag.args[0]).toEqual(extension);
      expect(tag.args[1]).toEqual('process');
      expect(tag.args[3]).toEqual(['some content']);
    });
  });
});