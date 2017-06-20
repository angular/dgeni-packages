import { TsParser } from '.';
import { FileInfo } from './FileInfo';
const path = require('canonical-path');

describe('FileInfo', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../../mocks');
  });

  it('should compute the file path properties from the parsed file', () => {
    const parseInfo = parser.parse(['tsParser/testSrc.ts'], basePath);

    const module = parseInfo.moduleSymbols[0];
    const fileInfo1 = new FileInfo(module.exportArray[0].declarations![0], basePath);
    expect(fileInfo1.baseName).toEqual('testSrc');
    expect(fileInfo1.basePath).toEqual(basePath);
    expect(fileInfo1.extension).toEqual('ts');
    expect(fileInfo1.filePath).toEqual(basePath + '/tsParser/testSrc.ts');
    expect(fileInfo1.location).toEqual(jasmine.objectContaining({ start: { line: 6, character: 30 }, end: { line: 28, character: 1 } }));
    expect(fileInfo1.projectRelativePath).toEqual('tsParser/testSrc.ts');
    expect(fileInfo1.relativePath).toEqual('tsParser/testSrc.ts');

    const fileInfo2 = new FileInfo(module.exportArray[1].declarations![0], basePath);
    expect(fileInfo2.baseName).toEqual('testSrc');
    expect(fileInfo2.basePath).toEqual(basePath);
    expect(fileInfo2.extension).toEqual('ts');
    expect(fileInfo2.filePath).toEqual(basePath + '/tsParser/testSrc.ts');
    expect(fileInfo2.location).toEqual(jasmine.objectContaining({ start: { line: 33, character: 10 }, end: { line: 33, character: 42 } }));
    expect(fileInfo2.projectRelativePath).toEqual('tsParser/testSrc.ts');
    expect(fileInfo2.relativePath).toEqual('tsParser/testSrc.ts');

    const fileInfo3 = new FileInfo(module.exportArray[2].declarations![0], basePath);
    expect(fileInfo3.baseName).toEqual('importedSrc');
    expect(fileInfo3.basePath).toEqual(basePath);
    expect(fileInfo3.extension).toEqual('ts');
    expect(fileInfo3.filePath).toEqual(basePath + '/tsParser/importedSrc.ts');
    expect(fileInfo3.location).toEqual(jasmine.objectContaining({ start: { line: 2, character: 12 }, end: { line: 2, character: 20 } }));
    expect(fileInfo3.projectRelativePath).toEqual('tsParser/importedSrc.ts');
    expect(fileInfo3.relativePath).toEqual('tsParser/importedSrc.ts');
  });
});
