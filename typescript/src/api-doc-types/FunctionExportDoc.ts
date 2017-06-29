import { Symbol } from 'typescript';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { OverloadInfo } from './OverloadInfo';

export class FunctionExportDoc extends ExportDoc {
  docType = 'function';
  overloads = this.symbol.getDeclarations().map(declaration => new OverloadInfo(this, declaration));

  constructor(
      moduleDoc: ModuleDoc,
      symbol: Symbol,
      basePath: string) {
    // For this container doc, we just use the first given declaration
    super(moduleDoc, symbol, symbol.getDeclarations()[0], basePath);
  }
}
