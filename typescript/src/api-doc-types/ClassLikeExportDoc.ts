/* tslint:disable:no-bitwise */
/* tslint:disable:max-classes-per-file */
import { ArrayLiteralExpression, CallExpression, Declaration, Decorator, Expression, ExpressionWithTypeArguments, HeritageClause, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, Symbol, SymbolFlags, SyntaxKind, TypeChecker } from 'typescript';

import { FileInfo } from "../services/TsParser/FileInfo";
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { getDecorators, ParsedDecorator } from "../services/TsParser/getDecorators";
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { getTypeText } from '../services/TsParser/getTypeText';

import { ContainerExportDoc } from './ContainerExportDoc';
import { ExportDoc } from './ExportDoc';
import { MemberDoc } from './MemberDoc';
import { MethodMemberDoc } from './MethodMemberDoc';
import { ModuleDoc } from './ModuleDoc';
import { PropertyMemberDoc } from './PropertyMemberDoc';

export class HeritageInfo {
  symbol: Symbol | undefined;
  doc: ClassLikeExportDoc | undefined;
  constructor(public type: ExpressionWithTypeArguments, public text: string) {}
}

/**
 * Interfaces and classes are "class-like", in that they can contain members, heritage, type parameters and decorators
 */
export abstract class ClassLikeExportDoc extends ContainerExportDoc {
  decorators = getDecorators(this.declaration);
  extendsClauses: HeritageInfo[] = [];
  implementsClauses: HeritageInfo[] = [];
  descendants: ClassLikeExportDoc[] = [];
  typeParams = this.computeTypeParams();

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      basePath: string,
      typeChecker: TypeChecker,
      namespacesToInclude: string[]) {
        super(moduleDoc, symbol, declaration, basePath, typeChecker, namespacesToInclude);
        this.computeHeritageClauses();
        this.addAliases();
      }

  private computeTypeParams() {
    if (this.symbol.members) {
      const typeParams: string[] = [];
      this.symbol.members.forEach((member, name) => {
        if (member.getFlags() & SymbolFlags.TypeParameter) {
          typeParams.push(name);
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
            clause.types.map(heritageType => new HeritageInfo(heritageType, getTypeText(heritageType, this.namespacesToInclude))));
        } else {
          this.implementsClauses = this.implementsClauses.concat(
            clause.types.map(heritageType => new HeritageInfo(heritageType, getTypeText(heritageType, this.namespacesToInclude))));
        }
      });
    });
  }
}

function getHeritage(declaration: Declaration): HeritageClause[] {
  return (declaration as any).heritageClauses || [];
}
