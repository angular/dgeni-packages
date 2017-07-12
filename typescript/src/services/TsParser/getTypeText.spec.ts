import { Declaration, Symbol, TypeNode } from 'typescript';
import { TsParser } from '.';
import { getTypeText } from './getTypeText';
const path = require('canonical-path');

describe('getTypeText', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return text representation of types', () => {
    const parseInfo = parser.parse(['tsParser/getTypeText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    expect(getTypeText(getType(moduleExports[1]), [])).toEqual('TestClass');
    expect(getTypeText(getType(moduleExports[2]), [])).toEqual('string');
    expect(getTypeText(getType(moduleExports[3]), [])).toEqual('number');
    expect(getTypeText(getType(moduleExports[4]), [])).toEqual('TestType');
    expect(getTypeText(getType(moduleExports[5]), [])).toEqual('TestClass | string');
    expect(getTypeText(getType(moduleExports[6]), [])).toEqual('{ x: number, y: string }');
    expect(getTypeText(getType(moduleExports[7]), [])).toEqual('Array<string>');
    expect(getTypeText(getType(moduleExports[8]), [])).toEqual('Array<T>');
  });

  it('should strip namespaces from types and their type parameters', () => {
    const parseInfo = parser.parse(['tsParser/getTypeText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    expect(getTypeText(getType(moduleExports[9]), [])).toEqual('IDirective');
    expect(getTypeText(getType(moduleExports[10]), [])).toEqual('Array<IDirective>');
  });

  it('should not strip namespaces that are marked as wanted', () => {
    const parseInfo = parser.parse(['tsParser/getTypeText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    expect(getTypeText(getType(moduleExports[9]), ['angular'])).toEqual('angular.IDirective');
    expect(getTypeText(getType(moduleExports[10]), ['angular'])).toEqual('Array<angular.IDirective>');
  });
});

function getType(symbol: Symbol) {
  return (symbol.getDeclarations()[0] as any).type as TypeNode;
}
