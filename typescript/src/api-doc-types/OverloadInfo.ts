import { Declaration } from 'typescript';
import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { FunctionExportDoc } from './FunctionExportDoc';
import { ModuleDoc } from './ModuleDoc';
import { getParameters, ParameterContainer } from './ParameterContainer';
import { ParameterDoc } from './ParameterDoc';
import { BaseApiDoc } from './ApiDoc';

/**
 * This represents a single overload of an exported function.
 * There will be a FunctionExportDoc that contains these overloads
 */
export class OverloadInfo extends BaseApiDoc implements ParameterContainer {
  docType = 'function-overload';

  readonly parameterDocs: ParameterDoc[] = getParameters(this);
  readonly parameters = this.parameterDocs.map(p => p.paramText);

  type = getDeclarationTypeText(this.declaration);
  containerDoc: ModuleDoc = this.functionDoc.containerDoc;

  constructor(public functionDoc: FunctionExportDoc, declaration: Declaration) {
    super(functionDoc.moduleDoc, functionDoc.symbol, declaration);
    // Give this overload doc a more specific id and aliases than it's container doc
    const paramString = `(${this.parameters.join(', ')})`;
    this.id += paramString;
    this.aliases = this.aliases.map(alias => alias + paramString);
  }
}
