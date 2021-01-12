const path = require('canonical-path');

const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');


describe("debugDumpProcessor", () => {
  it("should write out the docs to a file", () => {

    const writeFileSpy = jasmine.createSpy('writeFile').and.returnValue(Promise.resolve());
    const testPackage = mockPackage().factory('writeFile', function writeFile() { return writeFileSpy; });

    const dgeni = new Dgeni([testPackage]);
    const injector = dgeni.configureInjector();

    const readFilesProcessor = injector.get('readFilesProcessor');
    readFilesProcessor.basePath = path.resolve('some/path');

    const processor = injector.get('debugDumpProcessor');

    processor.outputPath = 'build/dump.txt';
    processor.$process([{ val: 'a' }, { val: 'b' }]);
    expect(writeFileSpy).toHaveBeenCalledWith(path.resolve('some/path/build/dump.txt'), "[ { val: 'a' }, { val: 'b' } ]");
  });
});