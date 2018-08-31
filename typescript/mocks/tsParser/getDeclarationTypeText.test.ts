/* tslint:disable:max-classes-per-file */

export const testConst = 42;

export function testFunction<T>(param1: T[]): number {
  return 0;
}

export class TestClass<T> {
  prop1: T[];
  prop2 = new OtherClass<T>();
  prop3: OtherClass<T, T> = new OtherClass();
  method(x: T): T { return x; }
}

export class OtherClass<T, K = T> {

}
