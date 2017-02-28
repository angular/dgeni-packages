export class LastParent {
  lastParentProp: number = 0;
}

export class Child extends FirstParent {
  childProp: boolean = false;
}

/**
 * To ensure that Dgeni properly recognizes classes from exports that will be parsed later,
 * the `FirstParent` class will be ordered after the `Child` class.
 **/
export class FirstParent extends LastParent {
  firstParentProp: string = 'Works';
  _privateProp: string = 'Private';
  private privateProp: string = 'Private';
}
