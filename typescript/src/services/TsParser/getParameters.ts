import { Declaration, ParameterDeclaration, SignatureDeclaration } from 'typescript';
import { getInitializer } from './getDeclarationTypeText';
import { getTypeText } from './getTypeText';
import { nodeToString } from './nodeToString';

export function getParameters(declaration: SignatureDeclaration, namespacesToInclude: string[]) {
  const parameters = getParameterDeclarations(declaration);
  if (!parameters) {
    const name = declaration.name ? nodeToString(declaration.name) : 'unknown';
    throw new Error(`Missing declaration parameters for "${name}" in ${declaration.getSourceFile().fileName} at line ${declaration.getStart()}`);
  }

  return parameters.map(parameter => {
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
  });
}

function getParameterDeclarations(declaration: Declaration): ParameterDeclaration[]|undefined {
  return (declaration as any).parameters;
}
