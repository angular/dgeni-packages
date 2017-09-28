import { SignatureDeclaration } from 'typescript';
import { TsParser } from '.';
import { getParameters } from './getParameters';
const path = require('canonical-path');

describe('getParameters', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return the parameters of the function', () => {
    const parseInfo = parser.parse(['tsParser/getParameters.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    const params = getParameters(moduleExports[0].getDeclarations()![0] as SignatureDeclaration, []);
    expect(params).toEqual([
      'a: string',
      'b: () => number',
      'c?: Date',
      'd = 45',
      'e: string = \'moo\'',
      '...args: string[]',
    ]);
  });
});
