import { TsParser } from './index';
var path = require('canonical-path');

describe('tsParser', function() {
  let log: any;
  let parser: TsParser;

  beforeEach(() => {
    log = require('dgeni/lib/mocks/log')(false);
    parser = new TsParser(log);
  });

  it("should parse a TS file", function() {
    var parseInfo = parser.parse(['testSrc.ts'], path.resolve(__dirname, '../../../mocks/tsParser'));
    var tsModules = parseInfo.moduleSymbols;
    expect(tsModules.length).toEqual(1);
    expect(tsModules[0].exportArray.length).toEqual(3);
    expect(tsModules[0].exportArray.map(function(i) { return i.name; })).toEqual(['MyClass', 'myFn', 'x']);
  });
});