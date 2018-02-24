/* tslint:disable:no-bitwise */
import { CompilerOptions, createProgram, NewLineKind, Program, Symbol, SymbolFlags, TypeChecker } from 'typescript';
import { CustomCompilerHost } from './CustomCompilerHost';

// This import lacks type definitions.
const path = require('canonical-path');

export { getExportDocType } from './getExportDocType';
export { getContent } from './getContent';
export { getAccessibility } from './getAccessibility';

export interface ModuleSymbols extends Array<ModuleSymbol> {
  typeChecker?: TypeChecker;
}
export interface ModuleSymbol extends Symbol {
  exportArray: AugmentedSymbol[];
}
export interface AugmentedSymbol extends Symbol {
  resolvedSymbol: Symbol;
}

export class TsParser {

  // These are the extension that we should consider when trying to load a module
  // During migration from Traceur, there is a mix of `.ts`, `.es6` and `.js` (atScript)
  // files in the project and the TypeScript compiler only looks for `.ts` files when trying
  // to load imports.
  extensions = ['.ts', '.js'];

  // The options for the TS compiler
  options: CompilerOptions = {
    allowNonTsExtensions: true,
    charset: 'utf8',
    newLine: NewLineKind.LineFeed,
  };

  constructor(private log: any) {}

  parse(fileNames: string[], baseDir: string) {

    // "Compile" a program from the given module filenames, to get hold of a
    // typeChecker that can be used to interrogate the modules, exports and so on.
    const host = new CustomCompilerHost(this.options, baseDir, this.extensions, this.log);
    const program: Program = createProgram(fileNames, this.options, host);
    const typeChecker = program.getTypeChecker();

    // Create an array of module symbols for each file we were given
    const moduleSymbols: ModuleSymbols = [];
    fileNames.forEach(fileName => {
      const sourceFile = program.getSourceFile(fileName);

      if (!sourceFile) {
        throw new Error('Invalid source file: ' + fileName);
      } else if (!(sourceFile as any).symbol) {
        // Some files contain only a comment and no actual module code
        this.log.warn('No module code found in ' + fileName);
      } else {
        moduleSymbols.push((sourceFile as any).symbol);
      }
    });

    moduleSymbols.forEach(tsModule => {
      // The type checker has a nice helper function that returns an array of Symbols representing the exports for a given module
      tsModule.exportArray = typeChecker.getExportsOfModule(tsModule) as AugmentedSymbol[];

      tsModule.exportArray.forEach(moduleExport => {
        // Although 'star' imports (e.g. `export * from 'some/module';) get resolved automatically by the compiler/binder,
        // it seems that explicit imports (e.g. `export {SomeClass} from 'some/module'`) do not so we have to do a little work.
        if (moduleExport.flags & SymbolFlags.Alias) {
          // To maintain the alias information (particularly the alias name) we just attach the original "resolved" symbol to the alias symbol
          moduleExport.resolvedSymbol = typeChecker.getAliasedSymbol(moduleExport);
        }
      });
    });

    moduleSymbols.typeChecker = typeChecker;

    return { host, moduleSymbols, program, typeChecker };
  }
}
