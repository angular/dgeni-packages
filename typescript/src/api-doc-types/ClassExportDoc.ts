/* tslint:disable:no-bitwise */
import { FunctionLikeDeclaration, Symbol, SymbolFlags } from 'typescript';
import { ClassLikeExportDoc } from '../api-doc-types/ClassLikeExportDoc';
import { MemberDoc } from '../api-doc-types/MemberDoc';
import { MethodMemberDoc } from '../api-doc-types/MethodMemberDoc';
import { ModuleDoc } from '../api-doc-types/ModuleDoc';

/**
 * Classes are Class-like but also can contain static members
 * and cannot have multiple declarations
 */
export class ClassExportDoc extends ClassLikeExportDoc {
  docType = 'class';
  constructorDoc: MethodMemberDoc|undefined;
  statics: MemberDoc[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    aliasSymbol?: Symbol) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, aliasSymbol);
    if (symbol.exports) {
      this.statics = this.getMemberDocs(symbol.exports, moduleDoc.hidePrivateMembers, true);
    }

    if (symbol.members) {
      // Get the constructor
      const constructorSymbol = symbol.members.get('__constructor');
      if (constructorSymbol && constructorSymbol.getFlags() & SymbolFlags.Constructor) {
        this.constructorDoc = this.getConstructorDoc(constructorSymbol);
      }
      // Get the instance members
      this.members = this.getMemberDocs(symbol.members, moduleDoc.hidePrivateMembers, false);
    }
  }

  private getConstructorDoc(constructorSymbol: Symbol) {
    let constructorDoc: MethodMemberDoc|null = null;
    const overloads: MethodMemberDoc[] = [];
    constructorSymbol.getDeclarations()!.forEach(declaration => {
      if ((declaration as FunctionLikeDeclaration).body) {
        // This is the "real" declaration of the method
        constructorDoc = new MethodMemberDoc(this, constructorSymbol, declaration, false, overloads);
      } else {
        // This is an overload signature of the method
        overloads.push(new MethodMemberDoc(this, constructorSymbol, declaration, false, overloads));
      }
    });
    return constructorDoc || overloads.shift();
  }
}
