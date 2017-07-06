import { SignatureDeclaration } from 'typescript';
import { TsParser } from '.';
import { getDeclarations } from './getDeclarations';
import { getDeclarationTypeText } from './getDeclarationTypeText';
const path = require('canonical-path');

describe('getDeclarationTypeText', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return a textual representation of the type the declaration', () => {
    const parseInfo = parser.parse(['tsParser/getDeclarationTypeText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    expect(getDeclarationTypeText(getDeclarations(moduleExports[0])[0])).toEqual('42');

    const testFunction = getDeclarations(moduleExports[1])[0] as SignatureDeclaration;
    expect(getDeclarationTypeText(testFunction)).toEqual('number');
    expect(getDeclarationTypeText(testFunction.parameters[0])).toEqual('T[]');
    expect(getDeclarationTypeText(testFunction.typeParameters![0])).toEqual('T');

    const testClass = moduleExports[2];
    expect(getDeclarationTypeText(getDeclarations(testClass.members!.get('property')!)[0])).toEqual('T[]');
    expect(getDeclarationTypeText(getDeclarations(testClass.members!.get('method')!)[0])).toEqual('T');
  });
});
