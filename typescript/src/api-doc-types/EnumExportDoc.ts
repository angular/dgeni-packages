import { Declaration, Symbol } from 'typescript';
import { ContainerExportDoc } from './ContainerExportDoc';
import { ModuleDoc } from './ModuleDoc';

/**
 * Enum docs contain members and can have multiple declaration, which are merged,
 * but they cannot have decorators or type parameters
 */
export class EnumExportDoc extends ContainerExportDoc {
  docType = 'enum';
  additionalDeclarations: Declaration[] = [];
  constructor(
    moduleDoc: ModuleDoc,
    symbol: Symbol,
    basePath: string,
    namespacesToInclude: string[],
  ) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, basePath, namespacesToInclude);
    this.additionalDeclarations = symbol.getDeclarations().filter(declaration => declaration !== this.declaration);
    if (symbol.exports) {
      this.members = this.getMemberDocs(symbol.exports, true, false);
    }
  }
}
