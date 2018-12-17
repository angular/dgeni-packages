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
    expect(moduleExports.length).toEqual(13);

    const types = moduleExports.map(e => [e.name, getType(e) && getTypeText(getType(e))]);
    expect(types).toContain(['TestType', 'TestClass']);
    expect(types).toContain(['testFunction', 'string']);
    expect(types).toContain(['testConst', 'number']);
    expect(types).toContain(['testLet', 'TestType']);
    expect(types).toContain(['TestUnion', 'TestClass | string']);
    expect(types).toContain(['TestLiteral', [
      '{',
      '    x: number;',
      '    y: string;',
      '}',
    ].join('\n')]);
    expect(types).toContain(['TestGeneric1', 'Array<string>']);
    expect(types).toContain(['TestGeneric2', 'Array<T>']);
  });

  it('should remove comments from the rendered text', () => {
    const parseInfo = parser.parse(['tsParser/getTypeText.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    const testType2 = moduleExports.find(e => e.name === 'TestType2') !;
    expect(getTypeText(getType(testType2))).toEqual([
      '{',
      '    a: number;',
      '    b: string;',
      '} & {',
      '    a: string;',
      '}',
    ].join('\n'));
  });
});

function getType(symbol: Symbol) {
  return (symbol.getDeclarations()![0] as any).type as TypeNode;
}
