import { Declaration, SignatureDeclaration, Symbol, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { getParameters } from '../services/TsParser/getParameters';
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
      basePath: string,
      typeChecker: TypeChecker,
      namespacesToInclude: string[]) {
    super(moduleDoc, symbol, declaration, basePath, typeChecker, namespacesToInclude);
  }
}
