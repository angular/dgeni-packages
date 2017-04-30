import { LastParent, TestInterface } from './inheritedMembers1';

export class FirstParent extends LastParent implements TestInterface {
  firstParentProp: string = 'Works';
  _privateProp: string = 'Private';
  private privateProp: string = 'Private';
}

