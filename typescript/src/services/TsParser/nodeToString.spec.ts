import { TsParser } from '.';
import { nodeToString } from './nodeToString';
const path = require('canonical-path');

describe('nodeToString', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return text representation of a node, with the comments stripped out', () => {
    const parseInfo = parser.parse(['tsParser/nodeToString.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    expect(nodeToString(moduleExports[0].declarations![0])).toEqual([
      'export class TestClass {',
      '    someProp: number;',
      '    constructor() {',
      '    }',
      '    foo(param1: string) { }',
      '}',
    ].join('\n'));
  });
});
