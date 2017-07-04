import { Declaration, Symbol, SyntaxKind } from 'typescript';
import { getDeclarations } from '../services/TsParser';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class TypeAliasExportDoc extends ExportDoc {
  docType = 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration);

  constructor(
      moduleDoc: ModuleDoc,
      exportSymbol: Symbol,
      basePath: string) {
    super(moduleDoc, exportSymbol, getTypeAliasDeclaration(getDeclarations(exportSymbol)), basePath);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
