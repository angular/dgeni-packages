import * as path from 'path';
import { CompilerOptions, Symbol } from 'typescript';

/**
 * Resolves the TypeScript module import path derived by the `paths` in `TypeScriptPackagesDef`.
 *
 * Implements a reverse lookup of the TypeScript `compilerOptions.paths` mapping.
 *
 * Example: `'@my/foo: ['./src/index.ts']` is the paths mapping.
 * TODO: add test spec
 */
export function resolveModulePath(symbol: Symbol, options: CompilerOptions): string | undefined {
  if (!options.paths) {
    return;
  }
  const paths = options.paths || [];
  const tsModules = Object.keys(paths);

  // Relative file path of this document, e.g. 'a/b/public_api.ts'
  const fileName = symbol.valueDeclaration!.getSourceFile().fileName;

  // Find the TypeScript module path, e.g. '@my/foo'
  const typeScriptModule = tsModules.find(tsModule => paths[tsModule]
    .some(p => path.normalize(p) === fileName));

  return typeScriptModule;
}
