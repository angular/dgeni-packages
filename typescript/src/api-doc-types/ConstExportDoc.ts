import { Symbol, Type, TypeFormatFlags, VariableDeclaration } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { ModuleDoc } from './ModuleDoc';

export class ConstExportDoc extends ExportDoc {
  docType = 'const';
  variableDeclaration = this.declaration as VariableDeclaration;
  type =  this.getTypeString();

  constructor(moduleDoc: ModuleDoc, symbol: Symbol, aliasSymbol?: Symbol) {
    super(moduleDoc, symbol, symbol.valueDeclaration!, aliasSymbol);
  }

  private getTypeString() {
    if (this.variableDeclaration.type) {
      return this.typeChecker.typeToString(this.typeChecker.getTypeFromTypeNode(this.variableDeclaration.type));
    } else if (this.variableDeclaration.initializer) {
      return this.typeChecker.typeToString(this.typeChecker.getTypeAtLocation(this.variableDeclaration.initializer));
    }
  }
}
