import { SignatureDeclaration } from 'typescript';
import { TsParser } from '.';
import { getDecorators, ParsedDecorator } from './getDecorators';
const path = require('canonical-path');

describe('getDecoratorSpec', () => {
  let parser: TsParser;
  let basePath: string;
  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
  });

  it('should return the decorators of the declarations', () => {
    const parseInfo = parser.parse(['tsParser/getDecorators.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    const testClass = moduleExports[0];

    const testMethodDeclaration = testClass.members!.get('method')!.getDeclarations()![0];
    const testParameters = (testMethodDeclaration as any).parameters;

    const classDecorators = getDecorators(testClass.getDeclarations()![0])!;
    const propertyDecorators = getDecorators(testClass.members!.get('property')!.getDeclarations()![0])!;
    const methodDecorators = getDecorators(testMethodDeclaration)!;

    testDecorator(classDecorators[0], 'classDecorator');
    testDecorator(classDecorators[1], 'classDecoratorFactory', true);

    testDecorator(propertyDecorators[0], 'propertyDecorator');
    testDecorator(propertyDecorators[1], 'propertyDecoratorFactory', true);

    testDecorator(methodDecorators[0], 'methodDecorator');
    testDecorator(methodDecorators[1], 'methodDecoratorFactory', true);

    testDecorator(getDecorators(testParameters[0])![0], 'paramDecorator');
    testDecorator(getDecorators(testParameters[1])![0], 'paramDecoratorFactory', true);
  });
});

function testDecorator(decorator: ParsedDecorator, name: string, isDecoratorFactory?: boolean) {
  expect(decorator.expression).toBeDefined();
  expect(decorator.name).toEqual(name);
  if (isDecoratorFactory) {
    expect(decorator.isCallExpression).toBeTruthy();
    expect(decorator.argumentInfo).toEqual(["'foo'", "'bar'"]);
    expect(decorator.arguments).toEqual(["'foo'", "'bar'"]);
  } else {
    expect(decorator.isCallExpression).toBeFalsy();
  }
}
