import { Declaration, TypeParameterDeclaration } from 'typescript';
import { getDeclarationTypeText } from './getDeclarationTypeText';

export function getTypeParameters(declaration: Declaration) {
  const typeParameters = (declaration as any).typeParameters as TypeParameterDeclaration[]|undefined;
  return typeParameters && typeParameters.map(typeParameter => getDeclarationTypeText(typeParameter));
}

export function getTypeParametersText(declaration: Declaration) {
  const typeParameters = getTypeParameters(declaration);
  return typeParameters ? `<${typeParameters.join(', ')}>` : '';
}
