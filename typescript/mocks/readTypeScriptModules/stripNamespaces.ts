/* tslint:disable:no-namespace */
export namespace angular {
  export interface IDirective {
    name: string;
  }
}

export function someFunctionWithNamespacedReturnValue(x: angular.IDirective): angular.IDirective {
  return {
    name: 'hello',
  };
}
