var rewire = require('rewire');
var path = require('canonical-path');
var Q = require('q');
var processorFactory = rewire('../../processors/debugDumpProcessor');

var mockPackage = require('dgeni-packages/base/spec/mockPackage');
var Dgeni = require('dgeni');

var writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Q());
processorFactory.__set__('writeFile', writeFileSpy);

var mockReadFilesProcessor = {
  basePath: path.resolve('some/path')
};

describe("debugDumpProcessor", function() {
  it("should write out the docs to a file", function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    var processor = injector.get('debugDumpProcessor');

    var processor = processorFactory(mockLog, mockReadFilesProcessor);
    processor.outputPath = 'build/dump.txt';
    processor.$process([{ val: 'a' }, { val: 'b' }]);
    expect(writeFileSpy).toHaveBeenCalledWith(path.resolve('some/path/build/dump.txt'), "[ { val: 'a' }, { val: 'b' } ]");
  });
});