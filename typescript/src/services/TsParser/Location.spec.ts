import { TsParser } from '.';
import { Location } from './Location';
import { __String } from 'typescript';
const path = require('canonical-path');

describe('Location', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should contain the start and end line and column of exports', () => {
    const parseInfo = parser.parse(['tsParser/Location.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    const testClassLocation = new Location(moduleExports[0].declarations![0]);
    expect(testClassLocation.start).toEqual({line: 0, character: 0});
    expect(testClassLocation.end).toEqual({line: 14, character: 1});

    const testFunctionLocation = new Location(moduleExports[1].declarations![0]);
    expect(testFunctionLocation.start).toEqual({line: 14, character: 1});
    expect(testFunctionLocation.end).toEqual({line: 21, character: 1});
  });

  it('should contain the start and end line and column of members', () => {
    const parseInfo = parser.parse(['tsParser/Location.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;

    const testClass = moduleExports[0];
    const property1Location = new Location(testClass.members!.get('property1' as __String)!.declarations![0]);
    expect(property1Location.start).toEqual({line: 3, character: 24});
    expect(property1Location.end).toEqual({line: 7, character: 20});

    const method1Location = new Location(testClass.members!.get('method1' as __String)!.declarations![0]);
    expect(method1Location.start).toEqual({line: 7, character: 20});
    expect(method1Location.end).toEqual({line: 13, character: 3});
  });
});
