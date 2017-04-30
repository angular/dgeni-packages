import { FirstParent } from './inheritedMembers2';

/**
 * This is just a test interface that has been added to ensure that Dgeni only recognizes
 * extends heritages.
 **/
export interface TestInterface {}

export class LastParent implements TestInterface {
  lastParentProp: number = 0;
}

export class Child extends FirstParent implements TestInterface {
  childProp: boolean = false;
}
