var Q = require('q');
var path = require('canonical-path');
var rewire = require('rewire');
var writeFilesFactory = rewire('../../processors/write-files');

var mockWriteFile = jasmine.createSpy('writeFile').and.returnValue(Q());
writeFilesFactory.__set__('writeFile', mockWriteFile);

var mockLog = require('dgeni/lib/mocks/log')(/* true */);

describe("writeFilesProcessor", function() {
  it("should write each document to a file", function() {
    var processor = writeFilesFactory(mockLog);
    processor.outputFolder = path.resolve('some/path');
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', outputPath: 'doc/path.html' }]);
    expect(mockWriteFile).toHaveBeenCalledWith(path.resolve('some/path/doc/path.html'), 'SOME RENDERED CONTENT');
  });
});