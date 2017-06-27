/* tslint:disable:no-bitwise */
import { ArrayLiteralExpression, CallExpression, Declaration, Decorator, Expression, HeritageClause, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, Symbol, SymbolFlags, SyntaxKind } from 'typescript';

import { FileInfo } from "../services/TsParser/FileInfo";
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { getDecorators } from "../services/TsParser/getDecorators";
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
  decorators: any[];
  heritage = '';
  typeParams = this.computeTypeParams();

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      basePath: string) {
        super(moduleDoc, symbol, declaration, basePath);
        this.computeHeritage(declaration);
        getDecorators(this.declaration);
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

  private computeHeritage(declaration: Declaration) {
    const heritageClauses = getHeritage(declaration);
    if (heritageClauses) {
      heritageClauses.forEach(heritageClause => {
        if (heritageClause.token === SyntaxKind.ExtendsKeyword) {
          this.heritage += ` extends ${heritageClause.types.map(heritageType => getTypeText(heritageType)).join(', ')}`;
        }
        if (heritageClause.token === SyntaxKind.ImplementsKeyword) {
          this.heritage += ` implements ${heritageClause.types.map(heritageType => getTypeText(heritageType)).join(', ')}`;
        }
      });
    }
  }
}

function getHeritage(declaration: Declaration): HeritageClause[] {
  return (declaration as any).heritageClauses;
}
