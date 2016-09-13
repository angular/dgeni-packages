export interface SomeThingConstructor {
  (name: string): any;
}

/**
 * interface
 */
export interface SomeThing {
  name: string;
  count: number;
}

/**
 * constant
 */
export const SomeThing : SomeThingConstructor = (name) => { return { name: name }; };