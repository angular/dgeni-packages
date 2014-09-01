var path = require('canonical-path');
var Q = require('q');

var mockPackage = require('dgeni-packages/base/spec/mockPackage');
var Dgeni = require('dgeni');

describe("writeFilesProcessor", function() {
  it("should write each document to a file", function() {
    var writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Q());
    var testPackage = mockPackage().factory('writeFile', function() { return writeFileSpy; });

    var dgeni = new Dgeni([testPackage]);
    var injector = dgeni.configureInjector();

    var readFilesProcessor = injector.get('readFilesProcessor');
    readFilesProcessor.basePath = path.resolve('some/path');

    var processor = injector.get('writeFilesProcessor');
    processor.outputFolder = 'build';
    processor.$process([{ renderedContent: 'SOME RENDERED CONTENT', outputPath: 'doc/path.html' }]);
    expect(writeFileSpy).toHaveBeenCalledWith(path.resolve('some/path/build/doc/path.html'), 'SOME RENDERED CONTENT');
  });
});