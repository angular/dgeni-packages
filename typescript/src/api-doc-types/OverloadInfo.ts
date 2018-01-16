import { Declaration, SignatureDeclaration, TypeChecker } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { ExportDoc } from './ExportDoc';
import { FunctionExportDoc } from './FunctionExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { getParameters, ParameterContainer } from './ParameterContainer';
import { ParameterDoc } from './ParameterDoc';

/**
 * This represents a single overload of an exported function.
 * There will be a FunctionExportDoc that contains these overloads
 */
export class OverloadInfo extends ExportDoc implements ParameterContainer {
  docType = 'function-overload';
  readonly parameterDocs = getParameters(this);
  readonly parameters = this.parameterDocs.map(p => p.paramText);
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);
  containerDoc: ModuleDoc = this.functionDoc.containerDoc;

  constructor(public functionDoc: FunctionExportDoc, declaration: Declaration) {
    super(functionDoc.moduleDoc, functionDoc.symbol, declaration);
    // Give this overload doc a more specific id and aliases than it's container doc
    const paramString = `(${this.parameters.join(', ')})`;
    this.id += paramString;
    this.aliases = this.aliases.map(alias => alias + paramString);
  }
}
