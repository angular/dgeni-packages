import { Declaration, SignatureDeclaration, Symbol, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { getTypeParametersText } from '../services/TsParser/getTypeParametersText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';

export abstract class ParameterizedExportDoc extends ExportDoc {
  typeParameters = getTypeParametersText(this.declaration, this.namespacesToInclude);

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      declaration: Declaration,
      aliasSymbol?: Symbol) {
    super(moduleDoc, symbol, declaration, aliasSymbol);
  }
}
