/* tslint:disable:no-bitwise */
import { ArrayLiteralExpression, CallExpression, Declaration, Decorator, Expression, HeritageClause, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, Symbol, SymbolFlags, SyntaxKind } from 'typescript';

import { FileInfo } from "../services/TsParser/FileInfo";
import { getAccessibility } from "../services/TsParser/getAccessibility";
import { getDecorators } from "../services/TsParser/getDecorators";
import { getTypeParametersString } from '../services/TsParser/getTypeParametersString';
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
  typeParams = '';

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      basePath: string) {
        super(moduleDoc, symbol, declaration, basePath);
        this.computeTypeParams();
        this.computeHeritage(declaration);
        getDecorators(this.declaration);
      }

  private computeTypeParams() {
    this.typeParams = this.symbol.declarations && getTypeParametersString(this.symbol.declarations[0]) || '';
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

  //           for (var exported in resolvedExport.exports) {
  //             if (exported === 'prototype') continue;
  //             if (this.hidePrivateMembers && exported.charAt(0) === '_') continue;
  //             var memberSymbol = resolvedExport.exports[exported];
  //             var memberDoc = createMemberDoc(memberSymbol, exportDoc, basePath, parseInfo.typeChecker);
  //             memberDoc.isStatic = true;
  //             docs.push(memberDoc);
  //             console.log('static export of export: ' + memberDoc.id + ' from ' + exportDoc.id + ' in ' + moduleDoc.id);
  //             exportDoc.statics.push(memberDoc);
  //           }

  //         if (this.sortClassMembers) {
  //           exportDoc.members.sort((a, b) => {
  //             if (a.name > b.name) return 1;
  //             if (a.name < b.name) return -1;
  //             return 0;
  //           });
  //           exportDoc.statics.sort(function(a, b) {
  //             if (a.name > b.name) return 1;
  //             if (a.name < b.name) return -1;
  //             return 0;
  //           });
          // }

function getHeritage(declaration: Declaration): HeritageClause[] {
  return (declaration as any).heritageClauses;
}
