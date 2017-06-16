import { getCombinedModifierFlags, ModifierFlags, Declaration } from 'typescript';

export function getExportAccessibility(declaration?: Declaration) {
  if (!declaration) return 'public';
  const flags = getCombinedModifierFlags(declaration);
  if (flags & ModifierFlags.Private) {
    return 'private';
  }
  if (flags & ModifierFlags.Protected) {
    return 'protected';
  }
  return 'public';
};
