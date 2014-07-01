var Q = require('q');
var path = require('canonical-path');
var rewire = require('rewire');
var writeFilesFactory = rewire('../../processors/write-files');

var mockWriteFile = jasmine.createSpy('writeFile').and.returnValue(Q());
writeFilesFactory.__set__('writeFile', mockWriteFile);

var mockLog = jasmine.createSpyObj('mockLog', ['silly', 'debug', 'info', 'warn', 'error']);
// Uncomment this line if you are debugging and want to see the log messages
//mockLog.debug.and.callFake(console.log);

describe("writeFilesProcessor", function() {
  it("should write each document to a file", function() {
    var processor = writeFilesFactory(mockLog);
    processor.outputFolder = path.resolve('some/path');
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', outputPath: 'doc/path.html' }]);
    expect(mockWriteFile).toHaveBeenCalledWith(path.resolve('some/path/doc/path.html'), 'SOME RENDERED CONTENT');
  });
});