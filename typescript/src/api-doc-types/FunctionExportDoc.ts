import { getDeclarationTypeText } from '../services/TsParser/getDeclarationTypeText';
import { getParameters } from '../services/TsParser/getParameters';
import { OverloadableExportDoc } from './OverloadableExportDoc';

export class FunctionExportDoc extends OverloadableExportDoc {
  docType: 'function';
  returnType = getDeclarationTypeText(this.declaration);
  parameters = getParameters(this.declaration);
}
