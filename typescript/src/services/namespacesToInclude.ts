// use `namespacesToInclude.push()` to inject your own namespaces here.
// these namespaces will not be stripped if used to qualify types.
// For example: `angular.IDirective` would normally be stripped to just `IDirective`,
// but by adding this to the array: `namespacesToInclude.push('angular')` we will get
// the full qualified name.
export function namespacesToInclude(): string[] {
  return [];
}
