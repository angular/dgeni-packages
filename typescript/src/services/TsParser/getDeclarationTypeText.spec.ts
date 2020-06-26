import { __String, SignatureDeclaration } from 'typescript';
import { TsParser } from '.';
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

    expect(getDeclarationTypeText(getExport('testConst').getDeclarations()![0])).toEqual('42');

    const testFunction = getExport('testFunction').getDeclarations()![0] as SignatureDeclaration;
    expect(getDeclarationTypeText(testFunction)).toEqual('number');
    expect(getDeclarationTypeText(testFunction.parameters[0])).toEqual('T[]');
    expect(getDeclarationTypeText(testFunction.typeParameters![0])).toEqual('T');

    const testClass = getExport('TestClass');
    const testClassDeclaration = testClass.getDeclarations()![0] as SignatureDeclaration;
    expect(getDeclarationTypeText(testClass.members!.get('prop1' as __String)!.getDeclarations()![0])).toEqual('T[]');
    expect(getDeclarationTypeText(testClass.members!.get('prop2' as __String)!.getDeclarations()![0])).toEqual('OtherClass<T>');
    expect(getDeclarationTypeText(testClass.members!.get('prop3' as __String)!.getDeclarations()![0])).toEqual('OtherClass<T, T>');
    expect(getDeclarationTypeText(testClass.members!.get('method'as __String)!.getDeclarations()![0])).toEqual('T');
    expect(getDeclarationTypeText(testClassDeclaration.typeParameters![0])).toEqual('T = any');

    function getExport(name: string) {
      return moduleExports.find(e => e.name === name)!;
    }
  });
});

