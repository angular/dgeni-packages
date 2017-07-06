import { Symbol } from 'typescript';
import { getDeclarations } from '../services/TsParser';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';

export class FunctionExportDoc extends ExportDoc {
  docType = 'function';
  overloads = getDeclarations(this.symbol).map(declaration => new OverloadInfo(this, declaration));

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      basePath: string) {
    // For this container doc, we just use the first given declaration
    super(moduleDoc, symbol, getDeclarations(symbol)[0], basePath);
  }
}
