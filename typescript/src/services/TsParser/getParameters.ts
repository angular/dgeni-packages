import { Declaration, ParameterDeclaration } from 'typescript';
import { getDeclarationTypeText } from './getDeclarationTypeText';

export function getParameters(declaration: Declaration) {
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

    paramText += (!parameter.type && parameter.initializer) ? ' = ' : ': ';

    paramText += getDeclarationTypeText(parameter);

    return paramText.trim();
  });
}

function getParameterDeclarations(declaration: Declaration): ParameterDeclaration[]|undefined {
  return (declaration as any).parameters;
}
