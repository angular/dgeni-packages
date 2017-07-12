import { Declaration, TypeParameterDeclaration } from 'typescript';
import { getDeclarationTypeText } from './getDeclarationTypeText';

export function getTypeParameters(declaration: Declaration, namespacesToInclude: string[]) {
  const typeParameters = (declaration as any).typeParameters as TypeParameterDeclaration[]|undefined;
  return typeParameters && typeParameters.map(typeParameter => getDeclarationTypeText(typeParameter, namespacesToInclude));
}

export function getTypeParametersText(declaration: Declaration, namespacesToInclude: string[]) {
  const typeParameters = getTypeParameters(declaration, namespacesToInclude);
  return typeParameters ? `<${typeParameters.join(', ')}>` : '';
}
