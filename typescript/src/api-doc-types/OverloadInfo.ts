import { Declaration, SignatureDeclaration, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { getParameters } from '../services/TsParser/getParameters';
import { ExportDoc } from './ExportDoc';
import { FunctionExportDoc } from './FunctionExportDoc';

/**
 * This represents a single overload of an exported function.
 * There will be a FunctionExportDoc that contains these overloads
 */
export class OverloadInfo extends ExportDoc {
  docType = 'function-overload';
  parameters = getParameters(this.declaration as SignatureDeclaration, this.namespacesToInclude);
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);

  constructor(public functionDoc: FunctionExportDoc, declaration: Declaration, typeChecker: TypeChecker) {
    super(functionDoc.moduleDoc, functionDoc.symbol, declaration, functionDoc.basePath, typeChecker, functionDoc.namespacesToInclude);
    // Give this overload doc a more specific id and aliases than it's container doc
    const paramString = `(${this.parameters.join(', ')})`;
    this.id += paramString;
    this.aliases = this.aliases.map(alias => alias + paramString);
  }
}
