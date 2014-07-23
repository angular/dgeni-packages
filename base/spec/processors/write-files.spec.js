var Q = require('q');
var path = require('canonical-path');
var rewire = require('rewire');
var writeFilesFactory = rewire('../../processors/write-files');

var writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Q());
writeFilesFactory.__set__('writeFile', writeFileSpy);

var mockLog = require('dgeni/lib/mocks/log')(/* true */);
var mockReadFilesProcessor = {
  basePath: path.resolve('some/path')
};

describe("writeFilesProcessor", function() {
  it("should write each document to a file", function() {
    var processor = writeFilesFactory(mockLog, mockReadFilesProcessor);
    processor.outputFolder = 'build';
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', outputPath: 'doc/path.html' }]);
    expect(writeFileSpy).toHaveBeenCalledWith(path.resolve('some/path/build/doc/path.html'), 'SOME RENDERED CONTENT');
  });
});