import { TsParser } from '.';
import { getExportDocType } from './getExportDocType';
const path = require('canonical-path');

describe('getExportDocType', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return the accessibility of class members', () => {
    const parseInfo = parser.parse(['tsParser/getExportDocType.test.ts'], basePath);

    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    expect(moduleExports.length).toEqual(7);

    const docTypes = moduleExports.map(e => getExportDocType(e));
    expect(docTypes).toContain('interface');
    expect(docTypes).toContain('class');
    expect(docTypes).toContain('function');
    expect(docTypes).toContain('enum');
    expect(docTypes).toContain('let');
    expect(docTypes).toContain('const');
    expect(docTypes).toContain('type-alias');
  });
});
