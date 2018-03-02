import { __String } from 'typescript';
import { TsParser } from '.';
import { getTypeParametersText } from './getTypeParametersText';
const path = require('canonical-path');

describe('getTypeParametersText', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return text representation of types', () => {
    const parseInfo = parser.parse(['tsParser/getTypeParametersText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    const testFunction = moduleExports[0].getDeclarations()![0];
    expect(getTypeParametersText(testFunction)).toEqual('<T, U, V>');

    const testClass = moduleExports[1];
    expect(getTypeParametersText(testClass.getDeclarations()![0])).toEqual('<T>');
    expect(getTypeParametersText(testClass.members!.get('method' as __String)!.getDeclarations()![0])).toEqual('<U>');
  });
});
