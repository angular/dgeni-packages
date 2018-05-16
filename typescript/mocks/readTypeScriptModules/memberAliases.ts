export class MyClass {
  bar: string;
  fn() { /* */ }
  foo(a: string);
  foo(a: number, b: string);
  foo(a: string|number, b?: string) { /* empty */}
}
