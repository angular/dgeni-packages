function classDecorator(target: any) {
  // do nothing
}
function classDecoratorFactory(foo: string, bar: string, x: Object) {
  return classDecorator;
}
function propertyDecorator(target: any, propertyKey: string) {
  // do nothing
}
function propertyDecoratorFactory(foo: string, bar: string) {
  return propertyDecorator;
}
function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // do nothing
}
function methodDecoratorFactory(foo: string, bar: string) {
  return methodDecorator;
}
function paramDecorator(target: any, propertyKey: string | symbol, parameterIndex: number) {
  // do nothing
}
function paramDecoratorFactory(foo: string, bar: string) {
  return paramDecorator;
}

/**
 * A class "decorated" class
 */
@classDecorator
@classDecoratorFactory('foo', 'bar', {
  // some comment that should be ignored
  value: 'xxx',
})
export class TestClass<T> {
  /**
   * Some property
   */
  @propertyDecorator
  @propertyDecoratorFactory('foo', /* ignore me */ 'bar')
  property: string;
  /**
   * Some method
   */
  @methodDecorator
  @methodDecoratorFactory('foo', 'bar')
  method(@paramDecorator param1: string, @paramDecoratorFactory('foo','bar') param2: number) {
    // do nothing
  }
}
