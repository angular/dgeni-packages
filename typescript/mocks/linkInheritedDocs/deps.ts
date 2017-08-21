// tslint:disable:variable-name
import { LastParent, TestInterface } from './index';

export class FirstParent extends LastParent implements TestInterface {
  firstParentProp: string = 'Works';
  private privateProp: string = 'Private';
}
