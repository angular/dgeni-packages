import { Declaration, Symbol } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { getParameters } from '../services/TsParser/getParameters';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';

export class FunctionExportDoc extends ExportDoc {
  docType = 'function';
  overloads = this.symbol.getDeclarations()
    .filter(declaration => declaration !== this.declaration)
    .map(declaration => new OverloadInfo(this, declaration));
  typeParameters = getTypeParametersText(this.declaration, this.namespacesToInclude);
  parameters = getParameters(this.declaration, this.namespacesToInclude);
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      basePath: string,
      namespacesToInclude: string[]) {
    super(moduleDoc, symbol, findRealDeclaration(symbol.getDeclarations()), basePath, namespacesToInclude);
  }

}

function findRealDeclaration(declarations: Declaration[]) {
  // For this container doc, we use the declaration that has a body or just the first given declaration
  return declarations.find(declaration => !!(declaration as any).body) || declarations[0];
}
