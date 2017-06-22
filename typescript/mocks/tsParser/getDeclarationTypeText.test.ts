export const testConst = 42;
export function testFunction<T>(param1: T[]): number {
  return 0;
}
export class TestClass<T> {
  property: T[];
  method(x: T): T { return x; }
}
