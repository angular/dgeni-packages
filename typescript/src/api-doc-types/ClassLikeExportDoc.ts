/* tslint:disable:no-bitwise */
import { ArrayLiteralExpression, CallExpression, Declaration, Decorator, Expression, HeritageClause, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, Symbol, SymbolFlags, SyntaxKind } from 'typescript';

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

/**
 * Interfaces and classes are "class-like", in that they can contain members, heritage, type parameters and decorators
 */
export abstract class ClassLikeExportDoc extends ContainerExportDoc {
  decorators = getDecorators(this.declaration);
  extendsClauses: string[] = [];
  implementsClauses: string[] = [];
  typeParams = this.computeTypeParams();

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      basePath: string) {
        super(moduleDoc, symbol, declaration, basePath);
        this.computeHeritage();
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

  private computeHeritage() {
    // Collect up all the heritage clauses from each declarartion
    // (interfaces can have multiple declarations, which are merged, each with their own heritage)
    this.symbol.getDeclarations().forEach(declaration => {
      const heritageClauses = getHeritage(declaration);
      if (heritageClauses) {
        heritageClauses.forEach(heritageClause => {
          if (heritageClause.token === SyntaxKind.ExtendsKeyword) {
            this.extendsClauses = this.extendsClauses.concat(heritageClause.types.map(heritageType => getTypeText(heritageType)));
          } else {
            this.implementsClauses = this.implementsClauses.concat(heritageClause.types.map(heritageType => getTypeText(heritageType)));
          }
        });
      }
    });
  }
}

function getHeritage(declaration: Declaration): HeritageClause[] {
  return (declaration as any).heritageClauses;
}
