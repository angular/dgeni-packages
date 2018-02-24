import { Declaration, ParameterDeclaration, Symbol } from 'typescript';
import { getDeclarationTypeText, getInitializer } from '../services/TsParser/getDeclarationTypeText';
import { getTypeText } from '../services/TsParser/getTypeText';
import { nodeToString } from '../services/TsParser/nodeToString';
import { BaseApiDoc } from './ApiDoc';
import { ParameterContainer } from './ParameterContainer';

/**
 * This represents a call parameter of an exported function or of a method of a class or interface.
 * You can find them on the `FunctionExportDoc.parameters` or `MethodMemberDoc.parameters` properties.
 * They are generated by the call to `getParameters` service.
 */
export class ParameterDoc extends BaseApiDoc {
  docType = 'parameter';
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);
  paramText = getParamText(this.declaration as ParameterDeclaration, this.namespacesToInclude);
  description = this.content;

  constructor(public container: ParameterContainer,
              public symbol: Symbol,
              public declaration: Declaration) {
    super(container.moduleDoc, symbol, declaration);

    this.id = `${this.container.id}~${this.name}`;
    this.aliases = (this.container.aliases || []).map(alias => `${alias}~${this.name}`);
  }
}

function getParamText(parameter: ParameterDeclaration, namespacesToInclude: string[]) {
  let paramText = '';

  if (parameter.dotDotDotToken) paramText += '...';

  paramText += nodeToString(parameter.name);

  if (parameter.questionToken) paramText += '?';

  const type = parameter.type;
  if (type) {
    paramText += ': ' + getTypeText(type, namespacesToInclude);
  }

  const initializer = getInitializer(parameter);
  if (initializer) {
    paramText += ' = ' + nodeToString(initializer);
  }

  return paramText.trim();
}
