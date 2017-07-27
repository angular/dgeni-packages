import { TsParser } from '.';
import { FileInfo } from './FileInfo';
const fs = require('fs');
const path = require('canonical-path');

describe('FileInfo', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    spyOn(fs, 'realpathSync').and.callFake((filePath: string) => filePath + '.real');

    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should compute the file path properties from the parsed file', () => {
    const parseInfo = parser.parse(['tsParser/testSrc.ts'], basePath);

    const module = parseInfo.moduleSymbols[0];
    const fileInfo1 = new FileInfo(module.exportArray[0].declarations![0], basePath);
    expect(fileInfo1.baseName).toBe('testSrc');
    expect(fileInfo1.basePath).toBe(basePath);
    expect(fileInfo1.extension).toBe('ts');
    expect(fileInfo1.filePath).toBe(basePath + '/tsParser/testSrc.ts');
    expect(fileInfo1.location).toEqual(jasmine.objectContaining({ start: { line: 6, character: 30 }, end: { line: 28, character: 1 } }));
    expect(fileInfo1.projectRelativePath).toBe('tsParser/testSrc.ts');
    expect(fileInfo1.realFilePath).toBe(fileInfo1.filePath + '.real');
    expect(fileInfo1.realProjectRelativePath).toBe('tsParser/testSrc.ts.real');
    expect(fileInfo1.relativePath).toBe('tsParser/testSrc.ts');

    const fileInfo2 = new FileInfo(module.exportArray[1].declarations![0], basePath);
    expect(fileInfo2.baseName).toBe('testSrc');
    expect(fileInfo2.basePath).toBe(basePath);
    expect(fileInfo2.extension).toBe('ts');
    expect(fileInfo2.filePath).toBe(basePath + '/tsParser/testSrc.ts');
    expect(fileInfo2.location).toEqual(jasmine.objectContaining({ start: { line: 33, character: 10 }, end: { line: 33, character: 42 } }));
    expect(fileInfo2.projectRelativePath).toBe('tsParser/testSrc.ts');
    expect(fileInfo2.realFilePath).toBe(fileInfo2.filePath + '.real');
    expect(fileInfo2.realProjectRelativePath).toBe('tsParser/testSrc.ts.real');
    expect(fileInfo2.relativePath).toBe('tsParser/testSrc.ts');

    const fileInfo3 = new FileInfo(module.exportArray[2].declarations![0], basePath);
    expect(fileInfo3.baseName).toBe('importedSrc');
    expect(fileInfo3.basePath).toBe(basePath);
    expect(fileInfo3.extension).toBe('ts');
    expect(fileInfo3.filePath).toBe(basePath + '/tsParser/importedSrc.ts');
    expect(fileInfo3.location).toEqual(jasmine.objectContaining({ start: { line: 2, character: 12 }, end: { line: 2, character: 20 } }));
    expect(fileInfo3.projectRelativePath).toBe('tsParser/importedSrc.ts');
    expect(fileInfo3.realFilePath).toBe(fileInfo3.filePath + '.real');
    expect(fileInfo3.realProjectRelativePath).toBe('tsParser/importedSrc.ts.real');
    expect(fileInfo3.relativePath).toBe('tsParser/importedSrc.ts');
  });

  describe('getRealFilePath()', () => {
    const originalPathSep = path.sep;
    afterEach(() => path.sep = originalPathSep);

    it('should call `fs.realpathSync()`', () => {
      const parseInfo = parser.parse(['tsParser/testSrc.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];
      const fileInfo = new FileInfo(module.exportArray[0].declarations![0], basePath);

      expect(fs.realpathSync).toHaveBeenCalledWith(fileInfo.filePath);
    });

    it('should normalize path separators to `/`', () => {
      const parseInfo = parser.parse(['tsParser/testSrc.ts'], basePath);
      const module = parseInfo.moduleSymbols[0];
      let fileInfo;

      path.sep = '\\';
      fs.realpathSync.and.returnValue('C:\\Foo\\bar.ts');
      fileInfo = new FileInfo(module.exportArray[0].declarations![0], basePath);

      expect(fileInfo.realFilePath).toBe('C:/Foo/bar.ts');

      path.sep = '/';
      fs.realpathSync.and.returnValue('/Foo/bar.ts');
      fileInfo = new FileInfo(module.exportArray[0].declarations![0], basePath);

      expect(fileInfo.realFilePath).toBe('/Foo/bar.ts');
    });
  });
});
