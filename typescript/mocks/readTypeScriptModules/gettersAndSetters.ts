export class Test {
  get foo1(): string { return null; }
  /** foo1 setter */
  set foo1(value: string) { /* do nothing */}

  set foo2(value: string) { /* do nothing */}
  /** foo2 getter */
  get foo2(): string { return null; }

  /** bar getter */
  get bar(): number { return null; }

  /** qux setter */
  set qux(value: object) { /* do nothing */ }

  /** This has no explicit getter return type */
  get noType() { return 'x'; }
  /** So we get it from the setter instead */
  set noType(value: string) { /**/ }

  /** Description of myProperty. */
  @SomeDecorator()
  set decoratorProp(value: string) {}
  get decoratorProp() { return 'Hello'; }
}

export function SomeDecorator() {
  return (target: any, args: any) => {}
}