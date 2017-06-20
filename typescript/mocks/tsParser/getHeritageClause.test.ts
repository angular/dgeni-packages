/* tslint:disable:no-empty-interface */
/* tslint:disable:max-classes-per-file */

export interface Base1 {}
export interface Base2 {}
export interface Test1 extends Base1 {}
export interface Test2 extends Base1, Base2 {}

export class Base3 {}
export class Test3 extends Base3 {}
export class Test4 implements Base1 {}
export class Test5 implements Base1, Base2 {}
export class Test6 extends Base3 implements Base1 {}
export class Test7 extends Base3 implements Base1, Base2 {}
