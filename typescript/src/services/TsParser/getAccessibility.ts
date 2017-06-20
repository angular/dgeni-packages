/* tslint:disable:no-bitwise */
import { Declaration, getCombinedModifierFlags, ModifierFlags } from 'typescript';

export function getAccessibility(declaration?: Declaration) {
  if (declaration) {
    const flags = getCombinedModifierFlags(declaration);
    if (flags & ModifierFlags.Private) {
      return 'private';
    }
    if (flags & ModifierFlags.Protected) {
      return 'protected';
    }
  }
  return 'public';
}
