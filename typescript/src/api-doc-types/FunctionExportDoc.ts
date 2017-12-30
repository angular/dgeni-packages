import { Declaration, SignatureDeclaration, Symbol, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';
import { getParameters, ParameterContainer } from './ParameterContainer';
import { ParameterDoc } from './ParameterDoc';
import { ParameterizedExportDoc } from './ParameterizedExportDoc';

export class FunctionExportDoc extends ParameterizedExportDoc implements ParameterContainer {
  docType = 'function';
  overloads = this.symbol.getDeclarations()!
    .filter(declaration => declaration !== this.declaration)
    .map(declaration => new OverloadInfo(this, declaration));
  readonly parameterDocs = getParameters(this);
  readonly parameters = this.parameterDocs.map(p => p.paramText);
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(
      public containerDoc: ModuleDoc,
      symbol: Symbol,
      aliasSymbol?: Symbol) {
    super(containerDoc, symbol, findRealDeclaration(symbol.getDeclarations()!), aliasSymbol);
  }

}

function findRealDeclaration(declarations: Declaration[]) {
  // For this container doc, we use the declaration that has a body or just the first given declaration
  return declarations.find(declaration => !!(declaration as any).body) || declarations[0];
}
