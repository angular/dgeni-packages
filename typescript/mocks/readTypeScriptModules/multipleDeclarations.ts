export interface SomeThingConstructor {
  (name: string): any;
  x?: number;
}

/**
 * the interface doc
 */
export interface SomeThing {
  name: string;
  count: number;
}

/**
 * the constant doc
 */
export const SomeThing: SomeThingConstructor = (name) => ({ name });
