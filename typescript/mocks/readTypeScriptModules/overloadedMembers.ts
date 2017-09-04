export abstract class TestClass {
  constructor(x: string, y: number);
  constructor(x: string, y: string, z: number);
  constructor(x: string, y: number|string, z?: number) {
    // do nothing
  }
  /**
   * String foo
   * @other foo
   */
  foo(str: string): number;
  /**
   * Number foo
   */
  foo(num1: number, num2: number): number;

  /**
   * Actual implementation
   */
  foo(num1: number|string, num2?: number) {
    return 100;
  }

  abstract bar(str: string): number;
  abstract bar(): string;
}
