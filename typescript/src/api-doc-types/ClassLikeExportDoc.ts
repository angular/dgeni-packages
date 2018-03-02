/* tslint:disable:no-bitwise */
/* tslint:disable:max-classes-per-file */
import { Declaration, ExpressionWithTypeArguments, HeritageClause, Symbol, SymbolFlags, SyntaxKind, symbolName } from 'typescript';
import { getDecorators, ParsedDecorator } from "../services/TsParser/getDecorators";
import { getTypeText } from '../services/TsParser/getTypeText';

import { ContainerExportDoc } from './ContainerExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class HeritageInfo {
  symbol: Symbol | undefined;
  doc: ClassLikeExportDoc | undefined;
  constructor(public type: ExpressionWithTypeArguments, public text: string) {}
}

/**
 * Interfaces and classes are "class-like", in that they can contain members, heritage, type parameters and decorators
 */
export abstract class ClassLikeExportDoc extends ContainerExportDoc {
  decorators: ParsedDecorator[] | undefined = getDecorators(this.declaration);
  extendsClauses: HeritageInfo[] = [];
  implementsClauses: HeritageInfo[] = [];
  descendants: ClassLikeExportDoc[] = [];
  typeParams = this.computeTypeParams();

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      aliasSymbol?: Symbol) {
        super(moduleDoc, symbol, declaration, aliasSymbol);
        this.computeHeritageClauses();
        this.addAliases();
      }

  private computeTypeParams() {
    if (this.symbol.members) {
      const typeParams: string[] = [];
      this.symbol.members.forEach((member) => {
        if (member.getFlags() & SymbolFlags.TypeParameter) {
          typeParams.push(symbolName(member));
        }
      });
      if (typeParams.length) return `<${typeParams.join(', ')}>`;
    }
    return '';
  }

  private addAliases() {
    if (this.typeParams) {
      // Make sure duplicate aliases aren't created, so "Ambiguous link" warnings are prevented
      this.aliases.push(this.name + this.typeParams);
      this.aliases.push(this.moduleDoc.id + '/' + this.name + this.typeParams);
    }
  }

  private computeHeritageClauses() {
    // Collect up all the heritage clauses from each declaration
    // (interfaces can have multiple declarations, which are merged, each with their own heritage)
    this.symbol.getDeclarations()!.forEach(declaration => {
      getHeritage(declaration).forEach(clause => {
      // Now process these clauses to find each "extends" and "implements" clause
        if (clause.token === SyntaxKind.ExtendsKeyword) {
          this.extendsClauses = this.extendsClauses.concat(
            clause.types.map(heritageType => new HeritageInfo(heritageType, getTypeText(heritageType))));
        } else {
          this.implementsClauses = this.implementsClauses.concat(
            clause.types.map(heritageType => new HeritageInfo(heritageType, getTypeText(heritageType))));
        }
      });
    });
  }
}

function getHeritage(declaration: Declaration): HeritageClause[] {
  return (declaration as any).heritageClauses || [];
}
