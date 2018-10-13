import { Symbol, VariableDeclaration } from 'typescript';
import { Host } from '../services/ts-host/host';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class ConstExportDoc extends ExportDoc {
  docType = 'const';
  variableDeclaration = this.declaration as VariableDeclaration;
  type =  this.getTypeString();

  constructor(host: Host,
              moduleDoc: ModuleDoc,
              symbol: Symbol,
              aliasSymbol?: Symbol) {
    super(host, moduleDoc, symbol, symbol.valueDeclaration!, aliasSymbol);
  }

  private getTypeString(): string | undefined {
    if (!this.variableDeclaration.type && !this.variableDeclaration.initializer) {
      return undefined;
    }

    const typeNode = this.variableDeclaration.type ?
      this.typeChecker.getTypeFromTypeNode(this.variableDeclaration.type) :
      this.typeChecker.getTypeAtLocation(this.variableDeclaration.initializer!);

    return this.host.typeToString(this.typeChecker, typeNode);
  }
}
