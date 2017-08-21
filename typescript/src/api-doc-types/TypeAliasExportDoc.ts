import { Declaration, Symbol, SyntaxKind, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class TypeAliasExportDoc extends ExportDoc {
  docType = 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(
      moduleDoc: ModuleDoc,
      exportSymbol: Symbol,
      basePath: string,
      typeChecker: TypeChecker,
      namespacesToInclude: string[]) {
    super(moduleDoc, exportSymbol, getTypeAliasDeclaration(exportSymbol.getDeclarations()), basePath, typeChecker, namespacesToInclude);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
