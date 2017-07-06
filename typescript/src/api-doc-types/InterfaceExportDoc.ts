import { Declaration, Map, Symbol } from 'typescript';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { MethodMemberDoc } from '../api-doc-types/MethodMemberDoc';
import { ModuleDoc } from '../api-doc-types/ModuleDoc';
import { getDeclarations } from '../services/TsParser';

/**
 * Interfaces are class-like but can also have multiple declarations that are merged together
 */
export class InterfaceExportDoc extends ClassLikeExportDoc {
  docType = 'interface';
  additionalDeclarations: Declaration[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    basePath: string) {
      super(moduleDoc, symbol, symbol.valueDeclaration || getDeclarations(symbol)[0]!, basePath);
      if (symbol.members) this.members = this.getMemberDocs(symbol.members, true, false);
      this.additionalDeclarations = getDeclarations(symbol).filter(declaration => declaration !== this.declaration);
    }
}
