export function test(...args: Array<any>): void {}

export interface Test {
  foo(...args: Array<any>): void;
  foo2: (...args: Array<any>) => void;
}
