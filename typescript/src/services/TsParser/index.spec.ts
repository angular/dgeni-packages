import { TsParser } from './index';
const path = require('canonical-path');

describe('tsParser', () => {
  let log: any;
  let parser: TsParser;

  beforeEach(() => {
    log = require('dgeni/lib/mocks/log')(false);
    parser = new TsParser(log);
  });

  it("should parse a TS file", () => {
    const parseInfo = parser.parse(['testSrc.ts'], path.resolve(__dirname, '../../mocks/tsParser'));
    const tsModules = parseInfo.moduleSymbols;
    expect(tsModules.length).toEqual(1);
    expect(tsModules[0].exportArray.length).toEqual(3);
    expect(tsModules[0].exportArray.map(i => i.name)).toEqual(['MyClass', 'myFn', 'x']);
  });
});
