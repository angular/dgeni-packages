export class LastParent implements TestInterface {
  lastParentProp: number = 0;
}

export class Child extends FirstParent implements TestInterface {
  childProp: boolean = false;
}

/**
 * To ensure that Dgeni properly recognizes classes from exports that will be parsed later,
 * the `FirstParent` class will be ordered after the `Child` class.
 **/
export class FirstParent extends LastParent implements TestInterface {
  firstParentProp: string = 'Works';
  _privateProp: string = 'Private';
  private privateProp: string = 'Private';
}

/**
 * This is just a test interface that has been added to ensure that Dgeni only recognizes
 * extends heritages.
 **/
export interface TestInterface {}
