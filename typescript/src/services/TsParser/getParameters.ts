import { Declaration, ParameterDeclaration, SignatureDeclaration } from 'typescript';
import { getInitializerText } from './getDeclarationTypeText';
import { getTypeText } from './getTypeText';

export function getParameters(declaration: SignatureDeclaration, namespacesToInclude: string[]) {
  const parameters = getParameterDeclarations(declaration);
  if (!parameters) {
    const name = declaration.name ? declaration.name.getText() : 'unknown';
    throw new Error(`Missing declaration parameters for "${name}" in ${declaration.getSourceFile().fileName} at line ${declaration.getStart()}`);
  }

  return parameters.map(parameter => {
    let paramText = '';

    if (parameter.dotDotDotToken) paramText += '...';

    paramText += parameter.name.getText();

    if (parameter.questionToken) paramText += '?';

    const type = parameter.type;
    if (type) {
      paramText += ': ' + getTypeText(type, namespacesToInclude);
    }

    const initializer = getInitializerText(parameter);
    if (initializer) {
      paramText += ' = ' + initializer;
    }

    return paramText.trim();
  });
}

function getParameterDeclarations(declaration: Declaration): ParameterDeclaration[]|undefined {
  return (declaration as any).parameters;
}
