import { Declaration, Symbol, SyntaxKind } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ModuleDoc } from './ModuleDoc';
import { ParameterizedExportDoc } from './ParameterizedExportDoc';

export class TypeAliasExportDoc extends ParameterizedExportDoc {
  docType = 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration);

  constructor(
    moduleDoc: ModuleDoc,
    exportSymbol: Symbol,
    aliasSymbol?: Symbol) {
    super(moduleDoc, exportSymbol, getTypeAliasDeclaration(exportSymbol.getDeclarations()!), aliasSymbol);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
