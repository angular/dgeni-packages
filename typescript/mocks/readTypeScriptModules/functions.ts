export function foo<T, R>(val: T): R {
  return val as any as R;
}
