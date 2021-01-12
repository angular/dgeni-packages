const path = require('canonical-path');

const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("writeFilesProcessor", () => {
  let processor, writeFileSpy, mockLog;


  beforeEach(() => {
    writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Promise.resolve());

    const testPackage = mockPackage().factory('writeFile', function writeFile() { return writeFileSpy; });

    const dgeni = new Dgeni([testPackage]);
    const injector = dgeni.configureInjector();

    const readFilesProcessor = injector.get('readFilesProcessor');
    readFilesProcessor.basePath = path.resolve('some/path');

    processor = injector.get('writeFilesProcessor');
    processor.outputFolder = 'build';

    mockLog = injector.get('log');
  });

  it("should write each document to a file", () => {
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', outputPath: 'doc/path.html' }]);
    expect(writeFileSpy).toHaveBeenCalledWith(path.resolve('some/path/build/doc/path.html'), 'SOME RENDERED CONTENT');
  });

  it("should log a debug message if a doc has no outputPath", () => {
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', id: 'doc1', docType: 'test' }]);
    expect(mockLog.debug).toHaveBeenCalledWith('Document "doc1, test" has no outputPath.');
  });
});