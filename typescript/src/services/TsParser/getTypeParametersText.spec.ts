import { } from 'typescript';
import { TsParser } from '.';
import { getDeclarations } from './getDeclarations';
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

    const testFunction = getDeclarations(moduleExports[0])[0];
    expect(getTypeParametersText(testFunction)).toEqual('<T, U, V>');

    const testClass = moduleExports[1];
    expect(getTypeParametersText(getDeclarations(testClass)[0])).toEqual('<T>');
    expect(getTypeParametersText(getDeclarations(testClass.members!.get('method')!)[0])).toEqual('<U>');
  });
});
