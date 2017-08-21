// tslint:disable:no-empty-interface
// tslint:disable:max-classes-per-file

import { FirstParent } from './deps';

/**
 * This is just a test interface that has been added to ensure that Dgeni only recognizes
 * extends heritages.
 */
export interface TestInterface {}

export class LastParent implements TestInterface {
  lastParentProp: number = 0;
}

export class Child extends FirstParent implements TestInterface {
  childProp: boolean = false;
}
