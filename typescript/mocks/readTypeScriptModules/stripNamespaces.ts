export module angular {
    export interface IDirective {
        name: string;
    }
}

export function someFunctionWithNamespacedReturnValue(): angular.IDirective {
    return {
        name: 'hello'
    };
}