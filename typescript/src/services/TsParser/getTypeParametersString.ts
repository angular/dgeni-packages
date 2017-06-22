import { Declaration, TypeParameterDeclaration } from 'typescript';
import { getDeclarationTypeText } from './getDeclarationTypeText';

export function getTypeParametersString(declaration: Declaration) {
  const typeParameters = (declaration as any).typeParameters as TypeParameterDeclaration[]|undefined;
  return typeParameters ? `<${typeParameters.map(typeParameter => getDeclarationTypeText(typeParameter)).join(', ')}>` : '';
}
