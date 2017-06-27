import { ClassDeclaration, InterfaceDeclaration } from 'typescript';
import { AugmentedSymbol, TsParser } from '.';
import { getHeritageClause } from './getHeritageClause';
const path = require('canonical-path');

describe('getHeritageClause', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return the accessibility of class members', () => {
    const parseInfo = parser.parse(['tsParser/getHeritageClause.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    const test1 = expect(getHeritageClause(find(moduleExports, 'Test1'))).toEqual(' extends Base1');
    const test2 = expect(getHeritageClause(find(moduleExports, 'Test2'))).toEqual(' extends Base1, Base2');
    const test3 = expect(getHeritageClause(find(moduleExports, 'Test3'))).toEqual(' extends Base3');
    const test4 = expect(getHeritageClause(find(moduleExports, 'Test4'))).toEqual(' implements Base1');
    const test5 = expect(getHeritageClause(find(moduleExports, 'Test5'))).toEqual(' implements Base1, Base2');
    const test6 = expect(getHeritageClause(find(moduleExports, 'Test6'))).toEqual(' extends Base3 implements Base1');
    const test7 = expect(getHeritageClause(find(moduleExports, 'Test7'))).toEqual(' extends Base3 implements Base1, Base2');
  });
});

function find(moduleExports: AugmentedSymbol[], name: string) {
  return moduleExports.find(value => value.name === name)!.declarations![0] as (ClassDeclaration|InterfaceDeclaration);
}
