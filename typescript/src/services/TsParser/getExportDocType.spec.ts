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
    expect(getExportDocType(moduleExports[0])).toEqual('interface');
    expect(getExportDocType(moduleExports[1])).toEqual('class');
    expect(getExportDocType(moduleExports[2])).toEqual('function');
    expect(getExportDocType(moduleExports[3])).toEqual('enum');
    expect(getExportDocType(moduleExports[4])).toEqual('let');
    expect(getExportDocType(moduleExports[5])).toEqual('const');
    expect(getExportDocType(moduleExports[6])).toEqual('type-alias');
  });
});
