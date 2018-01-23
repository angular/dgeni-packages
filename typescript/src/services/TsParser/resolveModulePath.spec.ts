import { TsParser } from '.';
import { resolveModulePath } from './resolveModulePath';
const path = require('canonical-path');

describe('resolveModulePath', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return the resolved module path derived by compilerOptions.paths', () => {
    parser.options.paths = {
      '@foo/bar': ['./tsParser/getExportDocType.test.ts']
    };

    const parseInfo = parser.parse(['tsParser/getExportDocType.test.ts'], basePath);
    const moduleSymbol = parseInfo.moduleSymbols[0];

    expect(resolveModulePath(moduleSymbol, parser.options)).toEqual('@foo/bar');
  });
});
