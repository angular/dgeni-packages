/* tslint:disable:no-bitwise */
import { Declaration, Symbol, SymbolFlags } from 'typescript';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { MemberDoc } from '../api-doc-types/MemberDoc' ;
import { MethodMemberDoc } from '../api-doc-types/MethodMemberDoc' ;
import { ModuleDoc } from '../api-doc-types/ModuleDoc';

/**
 * Classes are Class-like but also can contain static members
 * and cannot have multiple declarations
 */
export class ClassExportDoc extends ClassLikeExportDoc {
  docType = 'class';
  constructorDoc: MemberDoc;
  statics: MemberDoc[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    basePath: string,
    hidePrivateMembers: boolean) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, basePath);
    if (symbol.exports) {
      this.statics = this.getMemberDocs(symbol.exports, hidePrivateMembers, true);
    }
    if (symbol.members) {
      // Get the constructor
      const constructorSymbol = symbol.members.get('__constructor');
      if (constructorSymbol && constructorSymbol.getFlags() & SymbolFlags.Constructor) {
        this.constructorDoc = new MethodMemberDoc(this, constructorSymbol, constructorSymbol.getDeclarations()[0], this.basePath, false);
      }
      // Get the instance members
      this.members = this.getMemberDocs(symbol.members, hidePrivateMembers, false);
    }
  }
}
