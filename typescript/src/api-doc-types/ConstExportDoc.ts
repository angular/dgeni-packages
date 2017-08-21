import { Symbol, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class ConstExportDoc extends ExportDoc {
  docType = 'const';
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(moduleDoc: ModuleDoc, symbol: Symbol, basePath: string, typeChecker: TypeChecker, namespacesToInclude: string[]) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, basePath, typeChecker, namespacesToInclude);
  }
}
