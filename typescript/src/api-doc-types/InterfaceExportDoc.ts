import { Declaration, Map, Symbol, TypeChecker } from 'typescript';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { MethodMemberDoc } from '../api-doc-types/MethodMemberDoc';
import { ModuleDoc } from '../api-doc-types/ModuleDoc';

/**
 * Interfaces are class-like but can also have multiple declarations that are merged together
 */
export class InterfaceExportDoc extends ClassLikeExportDoc {
  docType = 'interface';
  additionalDeclarations: Declaration[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    basePath: string,
    typeChecker: TypeChecker,
    namespacesToInclude: string[]) {
      super(moduleDoc, symbol, symbol.valueDeclaration || symbol.getDeclarations()![0]!, basePath, typeChecker, namespacesToInclude);
      if (symbol.members) this.members = this.getMemberDocs(symbol.members, true, false);
      this.additionalDeclarations = symbol.getDeclarations()!.filter(declaration => declaration !== this.declaration);
    }
}
