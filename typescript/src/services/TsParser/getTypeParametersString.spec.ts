import { } from 'typescript';
import { TsParser } from '.';
import { getTypeParametersString } from './getTypeParametersString';
const path = require('canonical-path');

describe('getTypeParametersString', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../../mocks');
  });

  it('should return text representation of types', () => {
    const parseInfo = parser.parse(['tsParser/getTypeParametersString.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    const testFunction = moduleExports[0].getDeclarations()[0];
    expect(getTypeParametersString(testFunction)).toEqual('<T, U, V>');

    const testClass = moduleExports[1];
    expect(getTypeParametersString(testClass.getDeclarations()[0])).toEqual('<T>');
    expect(getTypeParametersString(testClass.members!.get('method')!.getDeclarations()[0])).toEqual('<U>');
  });
});
