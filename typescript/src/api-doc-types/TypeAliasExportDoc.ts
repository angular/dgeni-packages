import { Declaration, Symbol, SyntaxKind } from 'typescript';
import { Host } from '../services/ts-host/host';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ModuleDoc } from './ModuleDoc';
import { ParameterizedExportDoc } from './ParameterizedExportDoc';

export class TypeAliasExportDoc extends ParameterizedExportDoc {
  docType = 'type-alias';
  typeDefinition = getDeclarationTypeText(this.declaration);

  constructor(host: Host,
              moduleDoc: ModuleDoc,
              exportSymbol: Symbol,
              aliasSymbol?: Symbol) {

    super(host, moduleDoc, exportSymbol, getTypeAliasDeclaration(exportSymbol.getDeclarations()!),
        aliasSymbol);
  }
}

function getTypeAliasDeclaration(declarations: Declaration[]) {
  return declarations.find(declaration => declaration.kind === SyntaxKind.TypeAliasDeclaration)!;
}
