import { Declaration, Symbol, SyntaxKind } from 'typescript';
import { getDeclarationTypeText } from '../services/TSParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class TypeAliasExportDoc extends ExportDoc {
  docType: 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration);

  constructor(
      moduleDoc: ModuleDoc,
      exportSymbol: Symbol,
      basePath: string) {
    super(moduleDoc, exportSymbol, getTypeAliasDeclaration(exportSymbol.getDeclarations()), basePath);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
