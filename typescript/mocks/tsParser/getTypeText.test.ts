export class TestClass {}
export type TestType = TestClass;
export function testFunction(): string { return ''; }
export const testConst: number = 12;
export let testLet: TestType;
export type TestUnion = TestClass | string;
/* tslint:disable:interface-over-type-literal */
export type TestLiteral = { x: number, y: string };
/* tslint:disable:array-type */
export type TestGeneric1 = Array<string>;
export type TestGeneric2<T> = Array<T>;

export function function1(): angular.IDirective {
  return { name: 'hello' };
}

/* tslint:disable:array-type */
export function function2(): Array<angular.IDirective> {
  return [{ name: 'hello' }];
}

/* tslint:disable:no-namespace */
export namespace angular {
  export interface IDirective { name: string; }
}

export type TestType2 = {
  a: number; // line comment
  /* block comment before */
  b: string;
  /* block comment after */
} & {
  a: string;
};
