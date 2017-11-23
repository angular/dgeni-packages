export class TestClass {
  // this is a single line comment
  someProp: number;
  /** This is a jsdoc style comment */
  constructor() {
    /* This is a block comment */
  }
  foo(/* inline comment */ param1: string) {}
}
