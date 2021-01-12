const ngdocFileReaderFactory = require('./ngdoc');
const path = require('canonical-path');

describe("ngdocFileReader", () => {

  let fileReader;

  function createFileInfo(file, content, basePath) {
    return {
      fileReader: fileReader.name,
      filePath: file,
      baseName: path.basename(file, path.extname(file)),
      extension: path.extname(file).replace(/^\./, ''),
      basePath: basePath,
      relativePath: path.relative(basePath, file),
      content: content
    };
  }


  beforeEach(() => {
    fileReader = ngdocFileReaderFactory();
  });


  describe("defaultPattern", () => {
    it("should match .ngdoc files", () => {
      expect(fileReader.defaultPattern.test('abc.ngdoc')).toBeTruthy();
      expect(fileReader.defaultPattern.test('abc.js')).toBeFalsy();
    });
  });


  describe("getDocs", () => {
    it('should return an object containing info about the file and its contents', () => {
      const fileInfo = createFileInfo('foo/bar.ngdoc', 'A load of content', 'base/path');
      expect(fileReader.getDocs(fileInfo)).toEqual([{
        content: 'A load of content',
        startingLine: 1
      }]);
    });
  });
});

