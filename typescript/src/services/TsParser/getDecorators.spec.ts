import { __String, Declaration, SignatureDeclaration } from 'typescript';
import { AugmentedSymbol, TsParser } from '.';
import { getDecorators, ParsedDecorator } from './getDecorators';
const path = require('canonical-path');

describe('getDecoratorSpec', () => {
  let parser: TsParser;
  let basePath: string;
  let testClass: AugmentedSymbol;
  let testMethodDeclaration: Declaration;
  let testParameters: Declaration[];

  beforeEach(() => {
    parser = new TsParser(require('dgeni/lib/mocks/log')(false));
    basePath = path.resolve(__dirname, '../../mocks');
    const parseInfo = parser.parse(['tsParser/getDecorators.test.ts'], basePath);
    const moduleExports = parseInfo.moduleSymbols[0].exportArray;
    testClass = moduleExports[0];
    testMethodDeclaration = testClass.members!.get('method' as __String)!.getDeclarations()![0];
    testParameters = (testMethodDeclaration as any).parameters;
  });

  it('should return the decorators of a class declaration', () => {
    const classDecorators = getDecorators(testClass.getDeclarations()![0])!;

    const classDecorator = classDecorators[0];
    expect(classDecorator.expression).toBeDefined();
    expect(classDecorator.name).toEqual('classDecorator');
    expect(classDecorator.isCallExpression).toBeFalsy();

    const classDecoratorFactory = classDecorators[1];
    expect(classDecoratorFactory.expression).toBeDefined();
    expect(classDecoratorFactory.name).toEqual('classDecoratorFactory');
    expect(classDecoratorFactory.isCallExpression).toBeTruthy();
    expect(classDecoratorFactory.argumentInfo).toEqual(["'foo'", "'bar'", { value: "'xxx'"}]);
    expect(classDecoratorFactory.arguments).toEqual(["'foo'", "'bar'", '{\n    value: \'xxx\'\n}']);
  });

  it('should return the decorators of a property declaration', () => {
    const propertyDecorators = getDecorators(testClass.members!.get('property' as __String)!.getDeclarations()![0])!;
    const propertyDecorator = propertyDecorators[0];
    expect(propertyDecorator.expression).toBeDefined();
    expect(propertyDecorator.name).toEqual('propertyDecorator');
    expect(propertyDecorator.isCallExpression).toBeFalsy();

    const propertyDecoratorFactory = propertyDecorators[1];
    expect(propertyDecoratorFactory.expression).toBeDefined();
    expect(propertyDecoratorFactory.name).toEqual('propertyDecoratorFactory');
    expect(propertyDecoratorFactory.isCallExpression).toBeTruthy();
    expect(propertyDecoratorFactory.argumentInfo).toEqual(["'foo'", "'bar'"]);
    expect(propertyDecoratorFactory.arguments).toEqual(["'foo'", "'bar'"]);
  });

  it('should return the decorators of a method declaration', () => {
    const methodDecorators = getDecorators(testMethodDeclaration)!;
    const methodDecorator = methodDecorators[0];
    expect(methodDecorator.expression).toBeDefined();
    expect(methodDecorator.name).toEqual('methodDecorator');

    const methodDecoratorFactory = methodDecorators[1];
    expect(methodDecoratorFactory.expression).toBeDefined();
    expect(methodDecoratorFactory.name).toEqual('methodDecoratorFactory');
    expect(methodDecoratorFactory.isCallExpression).toBeTruthy();
    expect(methodDecoratorFactory.argumentInfo).toEqual(["'foo'", "'bar'"]);
    expect(methodDecoratorFactory.arguments).toEqual(["'foo'", "'bar'"]);
  });

  it('should return the decorators of a parameter declaration', () => {
    const paramDecorator = getDecorators(testParameters[0])![0];
    expect(paramDecorator.expression).toBeDefined();
    expect(paramDecorator.name).toEqual('paramDecorator');

    const paramDecoratorFactory = getDecorators(testParameters[1])![0];
    expect(paramDecoratorFactory.expression).toBeDefined();
    expect(paramDecoratorFactory.name).toEqual('paramDecoratorFactory');
    expect(paramDecoratorFactory.isCallExpression).toBeTruthy();
    expect(paramDecoratorFactory.argumentInfo).toEqual(["'foo'", "'bar'"]);
    expect(paramDecoratorFactory.arguments).toEqual(["'foo'", "'bar'"]);
  });
});
