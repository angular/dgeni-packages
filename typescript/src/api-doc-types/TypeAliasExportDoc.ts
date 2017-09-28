import { Declaration, Symbol, SyntaxKind, TypeAliasDeclaration, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ModuleDoc } from './ModuleDoc';
import { ParameterizedExportDoc } from './ParameterizedExportDoc';

export class TypeAliasExportDoc extends ParameterizedExportDoc {
  docType = 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(
    moduleDoc: ModuleDoc,
    exportSymbol: Symbol,
    basePath: string,
    typeChecker: TypeChecker,
    namespacesToInclude: string[]) {
    super(moduleDoc, exportSymbol, getTypeAliasDeclaration(exportSymbol.getDeclarations()!), basePath, typeChecker, namespacesToInclude);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
